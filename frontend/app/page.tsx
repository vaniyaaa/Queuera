import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Queuera — Schedule Your Social Media',
  description:
    'Schedule and publish posts to Facebook, Instagram, and LinkedIn from one simple dashboard.',
};

const primaryBtn =
  'inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors';
const secondaryBtn =
  'inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors';
const ghostBtn =
  'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors';

const features = [
  {
    title: 'Multi-Platform Support',
    description:
      'Connect Facebook Pages, Instagram Business accounts, and LinkedIn profiles. Compose once and publish everywhere you need.',
    icon: (
      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    title: 'Schedule in Advance',
    description:
      'Pick the exact date and time for each post. Queuera queues your content and publishes automatically when you are ready.',
    icon: (
      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    title: 'Post Instantly',
    description:
      'Need to go live now? Use Post Now to queue your content for publication in about 10 seconds — no waiting around.',
    icon: (
      <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-6.75L3.75 3v4.5M3.75 13.5v4.5M3.75 13.5h10.5" />
      </svg>
    ),
  },
];

const platforms = [
  { name: 'Facebook', color: 'bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20' },
  { name: 'Instagram', color: 'bg-pink-50 text-pink-700 border-pink-200' },
  { name: 'LinkedIn', color: 'bg-sky-50 text-[#0A66C2] border-sky-200' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            Queuera
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className={ghostBtn}>
              Sign In
            </Link>
            <Link href="/register" className={primaryBtn}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/60 via-white to-white">
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-28 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight">
            Schedule your social media. Effortlessly.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Queuera helps you plan, schedule, and publish posts to Facebook, Instagram, and
            LinkedIn from one clean dashboard — so you can stay consistent without the daily rush.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className={`${primaryBtn} px-8 py-3 text-base`}>
              Get Started Free
            </Link>
            <Link href="/login" className={`${secondaryBtn} px-8 py-3 text-base`}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Everything you need to stay on schedule</h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto">
            Built for creators, small teams, and anyone who wants reliable cross-platform publishing.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="w-11 h-11 rounded-lg bg-indigo-50 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Supported platforms</h2>
          <p className="mt-2 text-slate-600 text-sm">
            Connect the accounts you already use — we handle the publishing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {platforms.map((platform) => (
              <span
                key={platform.name}
                className={`inline-flex items-center rounded-full border px-5 py-2 text-sm font-semibold ${platform.color}`}
              >
                {platform.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Ready to simplify your social workflow?</h2>
        <p className="mt-3 text-slate-600">Create a free account and schedule your first post in minutes.</p>
        <Link href="/register" className={`${primaryBtn} mt-8 px-8 py-3 text-base`}>
          Get Started Free
        </Link>
      </section>

      <footer className="mt-auto bg-slate-100 border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-slate-500">
          <p>© 2026 Queuera</p>
          <nav className="flex gap-6">
            <Link href="/legal/privacy" className="text-indigo-600 hover:text-indigo-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="text-indigo-600 hover:text-indigo-700 transition-colors">
              Terms of Service
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
