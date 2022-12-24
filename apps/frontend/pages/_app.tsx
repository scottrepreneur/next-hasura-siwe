import { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { RainbowKitSiweNextAuthProvider } from '@rainbow-me/rainbowkit-siwe-next-auth';

import { WagmiConfig } from 'wagmi';
import { SessionProvider } from 'next-auth/react';
import { wagmiClient, chains } from '../utils/web3';
import theme from '../theme';

import '@rainbow-me/rainbowkit/styles.css';

const CustomApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchInterval: 1200 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <>
      <Head>
        <title>Welcome to My Contract Library!</title>
      </Head>
      <ChakraProvider theme={theme}>
        <WagmiConfig client={wagmiClient}>
          <SessionProvider session={session} refetchInterval={0}>
            <RainbowKitSiweNextAuthProvider>
              <RainbowKitProvider chains={chains} theme={darkTheme()}>
                <QueryClientProvider client={queryClient}>
                  <Component {...pageProps} />
                </QueryClientProvider>
              </RainbowKitProvider>
            </RainbowKitSiweNextAuthProvider>
          </SessionProvider>
        </WagmiConfig>
      </ChakraProvider>
    </>
  );
};

export default CustomApp;
