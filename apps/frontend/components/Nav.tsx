import Link from 'next/link';
import {
  Flex,
  Heading,
  Link as ChakraLink,
  useDisclosure,
  Icon,
  IconButton,
  useMediaQuery,
} from '@chakra-ui/react';
import { FaHamburger } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import Drawer from './Drawer';

const Nav = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const ConnectButton = dynamic(() => import('../components/ConnectButton'), {
    ssr: false,
  });

  const [upTo780] = useMediaQuery('(max-width: 780px)');

  return (
    <>
      <Flex
        minH={['75px', null, null, '200px']}
        justify='space-between'
        align='center'
        w='100%'
      >
        <Link href='/' passHref>
          <ChakraLink color='white'>
            <Heading>⛵</Heading>
          </ChakraLink>
        </Link>

        {upTo780 ? (
          <IconButton
            aria-label='Toggle Menu'
            icon={<Icon as={FaHamburger} />}
            onClick={onOpen}
            variant='outline'
          />
        ) : (
          <ConnectButton />
        )}
      </Flex>
      <Drawer isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Nav;
