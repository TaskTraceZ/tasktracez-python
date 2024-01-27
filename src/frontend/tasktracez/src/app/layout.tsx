import type { Metadata } from 'next';
import { Roboto_Condensed } from 'next/font/google';
import Navbar from '@/components/Navbar/Navbar';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import theme from './theme';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Tasktracez',
  description: 'Tasktracez',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body>
        {/* <Navbar /> */}
        <Providers>{children}</Providers>
      </body>
    </html>
  )
};
