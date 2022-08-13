import { Box } from '@chakra-ui/react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function Index() {
  return (
    <Box>
      <ConnectButton chainStatus='none' showBalance={false} />
    </Box>
  );
}

export default Index;
