import { Flex } from '@chakra-ui/react';
import dynamic from 'next/dynamic';

export function Index() {
  const ConnectButton = dynamic(() => import('../components/ConnectButton'), {
    ssr: false,
  });

  return (
    <Flex
      w='100%'
      h='100%'
      minH={['500px', null, null, '1000px']}
      align='center'
      justify='center'
    >
      <ConnectButton />
    </Flex>
  );
}

export default Index;
