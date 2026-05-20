import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ToastProvider from '@/components/providers/ToastProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Queuera — Social Media Scheduling',
  description: 'Schedule and manage your social media posts across Facebook, Instagram, and LinkedIn.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
