import React from 'react';
import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit';
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import { getCsrfToken, signIn, useSession, signOut } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import {
  useAccount,
  useEnsName,
  useNetwork,
  useSignMessage,
  useDisconnect,
} from 'wagmi';

const ConnectButton = () => {
  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const { data: ensName } = useEnsName({ address });
  const { data: session } = useSession();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();
  console.log(session);

  const handleLogin = async () => {
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: chain?.id,
        nonce: await getCsrfToken(),
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn('credentials', {
        message: JSON.stringify(message),
        redirect: false,
        signature,
        callbackUrl: '/',
      });
    } catch (error) {
      window.alert(error);
    }
  };

  const handleLogout = () => {
    signOut();
    disconnect();
  };

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => (
        <div
          {...(!mounted && {
            'aria-hidden': true,
            style: {
              opacity: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            },
          })}
        >
          {(() => {
            if (!mounted || !account || !chain) {
              return (
                <Button onClick={openConnectModal} variant='outline'>
                  Connect Wallet
                </Button>
              );
            }

            if (chain.unsupported) {
              return (
                <Button onClick={openChainModal} type='button'>
                  Wrong network
                </Button>
              );
            }

            return (
              <Flex gap={2}>
                <Button
                  onClick={openChainModal}
                  display='flex'
                  alignItems='center'
                >
                  {chain.hasIcon && chain.iconUrl && (
                    <Image
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                      width={25}
                      height={25}
                    />
                  )}
                </Button>

                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<Icon as={ChevronDownIcon} />}
                    border='2px'
                    borderColor={!session ? 'red.300' : 'green.500'}
                  >
                    {ensName || account.displayName}
                  </MenuButton>
                  <MenuList>
                    {!session ? (
                      <MenuItem onClick={() => handleLogin()}>Sign In</MenuItem>
                    ) : (
                      <MenuItem isDisabled>Signed In</MenuItem>
                    )}
                    <MenuItem onClick={openAccountModal}>Wallet</MenuItem>
                    <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
            );
          })()}
        </div>
      )}
    </RainbowConnectButton.Custom>
  );
};

export default ConnectButton;
