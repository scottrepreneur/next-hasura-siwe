import { Stack, Heading, Box, useMediaQuery } from '@chakra-ui/react';
import SiteLayout from '../../components/SiteLayout';
import ContractForm from '../../components/ContractForm';

const NewContract = () => {
  const [upTo780] = useMediaQuery('(max-width: 780px)');
  return (
    <SiteLayout>
      <Stack spacing={10} align='center'>
        {upTo780 ? (
          <Heading size='md'>Add a new contract</Heading>
        ) : (
          <Heading>Add a new contract</Heading>
        )}
        <Box minW={['80%', null, null, '40%']}>
          <ContractForm />
        </Box>
      </Stack>
    </SiteLayout>
  );
};

export default NewContract;
