import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <p className="text-6xl font-bold text-indigo-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-600 text-center max-w-md">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
      >
        Back to home
      </Link>
    </div>
  );
}
