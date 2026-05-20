'use client';

import { cn } from '@/lib/utils';

interface SchedulePickerProps {
  value: string;
  onChange: (iso: string) => void;
  isPostNow: boolean;
  onPostNowChange: (isPostNow: boolean) => void;
}

function postNowIso(): string {
  return new Date(Date.now() + 10000).toISOString();
}

function toDatetimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function minScheduleDatetimeLocal(): string {
  return toDatetimeLocalValue(new Date(Date.now() + 5 * 60 * 1000));
}

function defaultScheduleDatetimeLocal(): string {
  return toDatetimeLocalValue(new Date(Date.now() + 60 * 60 * 1000));
}

function datetimeLocalToIso(local: string): string {
  return new Date(local).toISOString();
}

export default function SchedulePicker({
  value,
  onChange,
  isPostNow,
  onPostNowChange,
}: SchedulePickerProps) {
  const localValue = toDatetimeLocalValue(new Date(value));

  function handleModeChange(postNow: boolean) {
    onPostNowChange(postNow);
    onChange(postNow ? postNowIso() : defaultScheduleDatetimeLocal());
  }

  function handleDatetimeChange(local: string) {
    onChange(datetimeLocalToIso(local));
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleModeChange(true)}
          className={cn(
            'flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
            isPostNow
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
          )}
        >
          Post Now
        </button>
        <button
          type="button"
          onClick={() => handleModeChange(false)}
          className={cn(
            'flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors',
            !isPostNow
              ? 'border-indigo-600 bg-indigo-600 text-white'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
          )}
        >
          Schedule for later
        </button>
      </div>

      {!isPostNow && (
        <div>
          <label htmlFor="scheduled-at" className="block text-sm font-medium text-slate-700 mb-1.5">
            Date & time
          </label>
          <input
            id="scheduled-at"
            type="datetime-local"
            min={minScheduleDatetimeLocal()}
            value={localValue}
            onChange={(e) => handleDatetimeChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="mt-1.5 text-xs text-slate-500">Must be at least 5 minutes from now</p>
        </div>
      )}

      {isPostNow && (
        <p className="text-sm text-slate-500">Your post will be published in about 10 seconds.</p>
      )}
    </div>
  );
}
