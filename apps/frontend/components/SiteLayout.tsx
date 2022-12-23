import { Flex, Heading } from '@chakra-ui/react';
import Nav from './Nav';
import { useSession } from 'next-auth/react';

const SiteLayout = ({ children }) => {
  const { data: session } = useSession();

  return (
    <Flex
      w='100%'
      h='100%'
      minH={['500px', null, null, '1000px']}
      justify='center'
    >
      <Flex w={['90%', null, null, '80%']} mx='auto' direction='column'>
        <Nav />
        {session ? (
          children
        ) : (
          <Flex w='100%' h='100%' pt={20} align='center' direction='column'>
            <Heading size='md'>Connect your wallet to get started</Heading>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default SiteLayout;
