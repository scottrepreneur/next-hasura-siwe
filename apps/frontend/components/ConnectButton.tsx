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
  HStack,
  Heading,
  Box,
  useMediaQuery,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import { useAccount, useEnsName, useDisconnect, useEnsAvatar } from 'wagmi';

const ConnectButton = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: ensAvatar } = useEnsAvatar({ address });

  const blockie = null; // TODO implement blockie or other solution
  const [upTo780] = useMediaQuery('(max-width: 780px)');

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
        authenticationStatus,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
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

                  <Menu placement='bottom-end'>
                    <MenuButton
                      as={Button}
                      rightIcon={<Icon as={ChevronDownIcon} />}
                    >
                      <HStack spacing={2} align='center'>
                        {(ensAvatar || blockie) && !upTo780 && (
                          <Box
                            height='25px'
                            width='25px'
                            borderRadius='50%'
                            overflow='hidden'
                          >
                            <Image
                              src={ensAvatar || blockie}
                              alt='User Avatar'
                              height='25px'
                              width='25px'
                            />
                          </Box>
                        )}

                        <Heading size='sm'>
                          {ensName || account.displayName}
                        </Heading>
                      </HStack>
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={openAccountModal}>Wallet</MenuItem>
                      <MenuItem onClick={() => disconnect()}>Sign Out</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

export default ConnectButton;
