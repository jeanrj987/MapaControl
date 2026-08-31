import { WeatherData, RegiaoId } from '../types/region';
import { EXCEL_CITIES } from '../data/cidadesExcel';

const CACHE_DURATION_MS = 20 * 60 * 1000; // 20 minutos de cache
const weatherMemoryCache = new Map<string, WeatherData>();

export interface CityCoords {
  name: string;
  lat: number;
  lon: number;
}

export const MAIN_CITIES_COORDS: Record<string, CityCoords> = {
  'Sorriso': { name: 'Sorriso', lat: -12.5444, lon: -55.7172 },
  'Sinop': { name: 'Sinop', lat: -11.8608, lon: -55.5095 },
  'Alta Floresta': { name: 'Alta Floresta', lat: -9.8756, lon: -56.0861 },
  'Cuiabá': { name: 'Cuiabá', lat: -15.6010, lon: -56.0979 },
  'Juína': { name: 'Juína', lat: -11.3789, lon: -58.7428 },
  'Sapezal': { name: 'Sapezal', lat: -13.5422, lon: -58.8108 },
  'Vilhena': { name: 'Vilhena', lat: -12.7406, lon: -60.1458 },
  'Primavera do Leste': { name: 'Primavera do Leste', lat: -15.5564, lon: -54.2988 },
  'Rondonópolis': { name: 'Rondonópolis', lat: -16.4677, lon: -54.6367 },
  'Porto Velho': { name: 'Porto Velho', lat: -8.7619, lon: -63.9039 },
  'Boa Vista': { name: 'Boa Vista', lat: 2.8197, lon: -60.6733 },
  'Altamira': { name: 'Altamira', lat: -3.2033, lon: -52.2064 },
  'Água Boa': { name: 'Água Boa', lat: -14.05, lon: -52.16 },
  'Lucas do Rio Verde': { name: 'Lucas do Rio Verde', lat: -13.05, lon: -55.91 },
};

// Mapeia códigos WMO para ícone e texto
export const parseWmoCode = (code: number): { icon: string; text: string } => {
  if (code === 0) return { icon: '☀️', text: 'Ensolarado' };
  if ([1, 2].includes(code)) return { icon: '⛅', text: 'Parcialmente Nublado' };
  if (code === 3) return { icon: '☁️', text: 'Nublado' };
  if ([45, 48].includes(code)) return { icon: '🌫️', text: 'Nevoeiro' };
  if ([51, 53, 55, 56, 57].includes(code)) return { icon: '🌧️', text: 'Garoa' };
  if ([61, 63, 65, 66, 67].includes(code)) return { icon: '🌧️', text: 'Chuva' };
  if ([71, 73, 75, 77].includes(code)) return { icon: '❄️', text: 'Neve' };
  if ([80, 81, 82].includes(code)) return { icon: '🌦️', text: 'Pancadas de Chuva' };
  if ([95, 96, 99].includes(code)) return { icon: '⛈️', text: 'Tempestade' };
  return { icon: '🌡️', text: 'Normal' };
};

export async function fetchWeather(cityName: string, lat: number, lon: number): Promise<WeatherData | null> {
  const cacheKey = `weather_${cityName}`;
  
  // Verifica cache em memória
  const cachedMemory = weatherMemoryCache.get(cacheKey);
  if (cachedMemory && (Date.now() - cachedMemory.updatedAt) < CACHE_DURATION_MS) {
    return cachedMemory;
  }

  // Verifica cache em sessionStorage
  try {
    const sessionItem = sessionStorage.getItem(cacheKey);
    if (sessionItem) {
      const parsed: WeatherData = JSON.parse(sessionItem);
      if (Date.now() - parsed.updatedAt < CACHE_DURATION_MS) {
        weatherMemoryCache.set(cacheKey, parsed);
        return parsed;
      }
    }
  } catch {
    // ignora erros de parse de cache
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    let response = await fetch(url).catch(() => null);
    if (!response || !response.ok) {
      // Pequeno retry em caso de instabilidade de rede ou limite momentâneo
      await new Promise((r) => setTimeout(r, 400));
      response = await fetch(url).catch(() => null);
    }
    if (!response || !response.ok) return null;

    const data = await response.json();
    const temp = Math.round(data.current?.temperature_2m ?? 0);
    const humidity = Math.round(data.current?.relative_humidity_2m ?? 0);
    const weatherCode = data.current?.weather_code ?? 0;
    const tempMax = Math.round(data.daily?.temperature_2m_max?.[0] ?? temp);
    const tempMin = Math.round(data.daily?.temperature_2m_min?.[0] ?? temp);
    const rainProbability = Math.round(data.daily?.precipitation_probability_max?.[0] ?? 0);

    const { icon, text } = parseWmoCode(weatherCode);

    const weatherObj: WeatherData = {
      temp,
      tempMax,
      tempMin,
      humidity,
      rainProbability,
      weatherCode,
      conditionText: text,
      icon,
      cityName,
      updatedAt: Date.now(),
    };

    weatherMemoryCache.set(cacheKey, weatherObj);
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(weatherObj));
    } catch {
      // ignora cota de storage excedida
    }

    return weatherObj;
  } catch (err) {
    console.warn(`[WeatherService] Falha ao carregar clima para ${cityName}:`, err);
    return null;
  }
}

export async function fetchBatchWeather(cities: { name: string; lat: number; lon: number }[]): Promise<Record<string, WeatherData>> {
  const results: Record<string, WeatherData> = {};
  const CHUNK_SIZE = 8;
  for (let i = 0; i < cities.length; i += CHUNK_SIZE) {
    const chunk = cities.slice(i, i + CHUNK_SIZE);
    await Promise.all(
      chunk.map(async (c) => {
        const data = await fetchWeather(c.name, c.lat, c.lon);
        if (data) {
          results[c.name] = data;
        }
      })
    );
  }
  return results;
}

export async function fetchWeatherForRegion(regionId: RegiaoId): Promise<WeatherData[]> {
  const regionCities = EXCEL_CITIES.filter((c) => c.regionId === regionId);
  const weatherMap = await fetchBatchWeather(
    regionCities.map((c) => ({ name: c.name, lat: c.lat, lon: c.lon }))
  );
  return Object.values(weatherMap);
}
