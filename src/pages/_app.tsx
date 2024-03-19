
import type { AppProps } from 'next/app';
import '../app/globals.css';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ Component, pageProps }: AppProps) {
  return <SessionProvider session={pageProps.session}>
    <Component {...pageProps} />
  </SessionProvider>

}
