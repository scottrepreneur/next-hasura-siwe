import {
  Drawer as ChakraDrawer,
  DrawerCloseButton,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerOverlay,
  Heading,
} from '@chakra-ui/react';
import ConnectButton from './ConnectButton';

const Drawer = ({ isOpen, onClose }) => {
  return (
    <ChakraDrawer isOpen={isOpen} onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          <Heading size='xl'>⛵</Heading>
        </DrawerHeader>

        <DrawerBody />

        <DrawerFooter>
          <ConnectButton />
        </DrawerFooter>
      </DrawerContent>
    </ChakraDrawer>
  );
};

export default Drawer;
