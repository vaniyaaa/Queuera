import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = { title: 'Create Account — Queuera' };

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
      <p className="text-sm text-slate-500 mb-6">Start scheduling your social media posts.</p>
      <RegisterForm />
    </>
  );
}
