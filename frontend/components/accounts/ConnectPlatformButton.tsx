'use client';
import Button from '@/components/ui/Button';
import PlatformIcon from './PlatformIcon';

interface ConnectPlatformButtonProps {
  platform: 'FACEBOOK' | 'LINKEDIN';
  loading: boolean;
  onClick: () => void;
}

export default function ConnectPlatformButton({ platform, loading, onClick }: ConnectPlatformButtonProps) {
  const label = platform === 'FACEBOOK' ? 'Connect Facebook & Instagram' : 'Connect LinkedIn';
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <PlatformIcon platform={platform} size={22} />
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {loading && (
        <svg className="w-4 h-4 animate-spin text-slate-400 ml-1" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      )}
    </button>
  );
}
