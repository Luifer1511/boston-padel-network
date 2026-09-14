import { useEffect, useState } from 'react';
import { CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import App from './App.jsx';
import { supabase } from './supabase.js';

export default function ProductionEntry() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      if (error) setErrorMsg(error.message);
      setSession(data?.session ?? null);
      setLoadingSession(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
      setLoadingSession(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const sendMagicLink = async (event) => {
    event.preventDefault();
    setSending(true);
    setErrorMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: window.location.origin,
      },
    });

    setSending(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSent(true);
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Loading Boston Padel…
      </div>
    );
  }

  if (session) return <App />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black tracking-tight text-emerald-400">BOSTON PADEL</h1>
          <p className="text-sm text-slate-400 mt-1">Autonomous Matchmaking Network</p>
        </div>

        {!sent ? (
          <>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-white">Sign in or create your account</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your email. We’ll send you a secure sign-in link — no password needed.
              </p>
            </div>

            <form onSubmit={sendMagicLink} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    autoComplete="email"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-black rounded-xl text-sm"
              >
                {sending ? 'Sending…' : 'Send Sign-In Link'}
              </button>
            </form>

            <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500">
              <ShieldCheck size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>New players are created automatically after confirming their email, then complete their Boston Padel profile.</span>
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
              <CheckCircle2 size={28} className="text-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Check your email</h2>
            <p className="text-sm text-slate-400 mt-2">
              We sent a secure sign-in link to <strong className="text-slate-200">{email.trim()}</strong>.
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-5 text-xs text-emerald-400 font-bold hover:text-emerald-300"
            >
              Use another email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
