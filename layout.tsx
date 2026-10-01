import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SeniorCare AI | Smart Healthcare & Caregiver Management',
  description: 'Next-generation platform for senior care scheduling, medical tracking, and caregiver dispatching.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
