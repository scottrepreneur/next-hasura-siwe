import _ from 'lodash';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Heading, Stack, Text, useMediaQuery } from '@chakra-ui/react';
import useContractDetail from '../../hooks/useContractDetail';
import SiteLayout from '../../components/SiteLayout';
import { formatAddress } from '../../utils';

const Contract = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const address = _.get(router, 'query.contract');
  const { data: contract } = useContractDetail({
    address,
    token: _.get(session, 'token'),
    user: _.get(session, 'user'),
  });

  const [upTo780] = useMediaQuery('(max-width: 780px)');

  if (!contract) return null;

  return (
    <SiteLayout>
      <Stack align='center' spacing={10}>
        {upTo780 ? (
          <Heading size='md'>Contract</Heading>
        ) : (
          <Heading>Contract</Heading>
        )}

        <Stack align='center' spacing={6}>
          <Heading size='sm'>Name: {_.get(contract, 'name')}</Heading>
          <Text>Address: {formatAddress(_.get(contract, 'address'))}</Text>
          <Text>Chain ID: {_.get(contract, 'chain_id')}</Text>
        </Stack>
      </Stack>
    </SiteLayout>
  );
};

export default Contract;
