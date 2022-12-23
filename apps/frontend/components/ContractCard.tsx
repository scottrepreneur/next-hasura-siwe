import _ from 'lodash';
import Link from 'next/link';
import {
  Flex,
  Heading,
  Text,
  Link as ChakraLink,
  Stack,
} from '@chakra-ui/react';
import { IContract } from '../types';
import { formatAddress } from '../utils';

type ContractCardProps = {
  contract: Partial<IContract>;
};

const ContractCard = ({ contract }: ContractCardProps) => (
  <Link href={`/contracts/${_.get(contract, 'address')}`}>
    <ChakraLink minW={['90%', null, null, '40%']} color='white'>
      <Flex
        align='center'
        gap={6}
        p={4}
        border='1px solid'
        borderColor='whiteAlpha.400'
        borderRadius={6}
        justify='space-around'
        w='100%'
      >
        <Stack>
          <Heading size='md'>{_.get(contract, 'name')}</Heading>
          <Text size='md'>{formatAddress(_.get(contract, 'address'))}</Text>
        </Stack>

        <Text>Chain: {_.get(contract, 'chainId')}</Text>
      </Flex>
    </ChakraLink>
  </Link>
);

export default ContractCard;
