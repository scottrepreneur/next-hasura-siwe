import _ from 'lodash';
import {
  Heading,
  SimpleGrid,
  Spacer,
  Stack,
  Button,
  GridItem,
  Flex,
  Link as ChakraLink,
  Icon,
  useMediaQuery,
  Text,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
// import { chain } from 'wagmi';
import ContractCard from '../components/ContractCard';
import SiteLayout from '../components/SiteLayout';
import useContractList from '../hooks/useContractList';

const SubHeading = () => {
  const [upTo780] = useMediaQuery('(max-width: 780px)');

  return (
    <SimpleGrid gridTemplateColumns='1fr 70% 1fr' w='100%'>
      <GridItem>
        <Spacer />
      </GridItem>
      <GridItem as={Flex} justify='center' align='center'>
        {upTo780 ? (
          <Heading size='md'>My Contracts</Heading>
        ) : (
          <Heading>My Contracts</Heading>
        )}
      </GridItem>
      <GridItem as={Flex} justify='flex-end'>
        <Link href='/contracts/new' passHref>
          <ChakraLink color='white'>
            <Button variant='outline'>
              {upTo780 ? (
                <Icon as={FaPlus} h='15px' w='15px' />
              ) : (
                <Text>New</Text>
              )}
            </Button>
          </ChakraLink>
        </Link>
      </GridItem>
    </SimpleGrid>
  );
};

const EmptyContracts = () => (
  <Flex pt={20}>
    <Stack align='center' spacing={8} mx='auto'>
      <Heading size='md'>No contracts found</Heading>
      <Link href='/contracts/new' passHref>
        <ChakraLink>
          <Button variant='outline'>New Contract</Button>
        </ChakraLink>
      </Link>
    </Stack>
  </Flex>
);

const Index = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: contracts } = useContractList({
    token,
    user: _.get(session, 'user'),
  });

  return (
    <SiteLayout>
      <Stack spacing={10}>
        <SubHeading />

        {!_.isEmpty(contracts) ? (
          <Stack spacing={6} align='center'>
            {_.map(contracts, (contract) => (
              <ContractCard key={contract.address} contract={contract} />
            ))}
          </Stack>
        ) : (
          <EmptyContracts />
        )}
      </Stack>
    </SiteLayout>
  );
};

export default Index;
