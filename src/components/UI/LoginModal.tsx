import React, { useEffect, useState } from 'react';
import { Lock, X } from './Icons';
import { signIn } from '../../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await signIn(email.trim(), password);

    setLoading(false);
    if (signInError) {
      setError(signInError);
      return;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        className="relative w-full max-w-sm bg-[#1D242E] border border-[#2E3A4B] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-slate-100 overflow-hidden"
      >
        <div className="absolute -top-20 -right-20 w-56 h-56 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 id="login-modal-title" className="text-base font-black tracking-wide text-white font-exo">
                Acesso Restrito
              </h2>
              <p className="text-xs text-slate-400">
                Edição do mapa disponível apenas para a equipe autorizada
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#202834] hover:bg-[#2E3A4B] text-slate-400 hover:text-white transition-colors border border-[#2E3A4B]"
            title="Fechar (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 z-10">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#131A26] border border-[#2E3A4B] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-sky-500 transition-colors"
              placeholder="seuemail@controlsoft.com.br"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Senha
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#131A26] border border-[#2E3A4B] rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-sky-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/40 border border-red-500/40 rounded-xl px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-sky-500/20"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};
