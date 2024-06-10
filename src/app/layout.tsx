import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import type { Viewport } from 'next'

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  icons: {
    icon: process.env.NEXT_PUBLIC_APP_FAVICON_URL,
  },
  // icons: [{
  //   rel: 'icon',
  //   url: process.env.NEXT_PUBLIC_APP_FAVICON_URL
  // }]
};


export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
