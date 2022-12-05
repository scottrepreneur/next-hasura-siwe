import { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';

import { WagmiConfig } from 'wagmi';
import { SessionProvider } from 'next-auth/react';
import { wagmiClient, chains } from '../utils/web3';

import '@rainbow-me/rainbowkit/styles.css';

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to next-hasura-siwe!</title>
      </Head>
      <ChakraProvider>
        <WagmiConfig client={wagmiClient}>
          <SessionProvider session={session} refetchInterval={0}>
            <RainbowKitSiweNextAuthProvider>
              <RainbowKitProvider chains={chains}>
                <main className='app'>
                  <Component {...pageProps} />
                </main>
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </SessionProvider>
        </WagmiConfig>
      </ChakraProvider>
    </>
  );
}

export default CustomApp;
