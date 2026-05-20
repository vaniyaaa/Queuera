import LoginForm from '@/components/auth/LoginForm';

export const metadata = { title: 'Sign In — Queuera' };

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
      <p className="text-sm text-slate-500 mb-6">Sign in to your Queuera account.</p>
      <LoginForm />
    </>
  );
}
