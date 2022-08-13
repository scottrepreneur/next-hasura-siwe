import { Flex, Stack, Button, Text, HStack } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { getCsrfToken, signIn, useSession, signOut } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { useAccount, useNetwork, useSignMessage } from 'wagmi';

export function Index() {
  const { data: session } = useSession();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const handleLogin = async () => {
    try {
      const callbackUrl = '/protected';
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
        callbackUrl,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  const handleLogout = () => {
    signOut();
  };

  return (
    <Flex
      w='100%'
      h='100%'
      minH={['500px', null, null, '1000px']}
      align='center'
      justify='center'
    >
      <Stack align='center'>
        <ConnectButton chainStatus='none' showBalance={false} />

        <HStack>
          <Button onClick={handleLogin}>Sign In</Button>
          <Button onClick={handleLogout}>Sign Out</Button>
          {session ? <Text>Signed In</Text> : <Text>Signed Out</Text>}
        </HStack>
      </Stack>
    </Flex>
  );
}

export default Index;
