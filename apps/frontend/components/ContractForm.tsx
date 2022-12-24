import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Flex,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaExclamation } from 'react-icons/fa';
import * as Yup from 'yup';
import useContractCreate from '../hooks/useContractCreate';
import { IContractCreate, IUser } from '../types';
import { isAddress } from 'ethers/lib/utils.js';
import { getErrorMessage } from '../utils';

const validationSchema = Yup.object().shape({
  address: Yup.string()
    .required('Address is required')
    .test(
      'isAddress',
      'Address is not valid',
      (value) => value && isAddress(value)
    ),
  name: Yup.string().required('Name is required'),
  chain_id: Yup.number().required('Chain ID is required'),
});

const contractFormInputs = [
  {
    label: 'Contract Address',
    name: 'address',
    type: 'text',
  },
  {
    label: 'Name',
    name: 'name',
    type: 'text',
  },
  {
    label: 'Chain ID',
    name: 'chain_id',
    type: 'number',
    options: { valueAsNumber: true },
  },
];

const ContractForm = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const user: Partial<IUser> = _.get(session, 'user');
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(validationSchema) });
  const { mutateAsync: createContract } = useContractCreate({
    token,
    user: _.get(user, 'address'),
  });

  const submitContract = async (data: IContractCreate) => {
    await createContract(data);
  };

  const errorKey = _.first(_.keys(errors));
  const errorMessage = errorKey && getErrorMessage(errorKey, errors);

  return (
    <Stack as='form' onSubmit={handleSubmit(submitContract)} spacing={6}>
      {_.map(contractFormInputs, ({ label, name, type, options }) => (
        <FormControl id={name} key={name}>
          <FormLabel>{label}</FormLabel>
          <Input
            {...register(name, options)}
            borderColor={
              _.includes(_.keys(errors), name) ? 'red.500' : undefined
            }
            type={type}
          />
        </FormControl>
      ))}

      <Flex justify='flex-end'>
        <HStack spacing={4}>
          {errorMessage && (
            <HStack>
              <Flex
                border='1px solid'
                borderColor='red.500'
                borderRadius='50%'
                w='20px'
                h='20px'
                justify='center'
                align='center'
              >
                <Icon as={FaExclamation} color='red.500' w='10px' h='10px' />
              </Flex>

              <Flex justify='center' color='red.500'>
                {errorMessage}
              </Flex>
            </HStack>
          )}
          <Button type='submit'>Submit</Button>
        </HStack>
      </Flex>
    </Stack>
  );
};

export default ContractForm;
