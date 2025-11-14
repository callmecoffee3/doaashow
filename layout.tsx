
'use client';

import type {Metadata} from 'next';
import { useEffect } from 'react';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

/*
export const metadata: Metadata = {
  title: 'Simulated Desktop',
  description: 'A simulated desktop environment by callmecoffee3',
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, err => {
          console.log('ServiceWorker registration failed: ', err);
        });
      });
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/logo192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />
        <title>Simulated Desktop</title>
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
