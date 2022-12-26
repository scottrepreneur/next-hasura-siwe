import _ from 'lodash';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@chakra-ui/react';
import { IContractCreate } from '../types';
import { client, CONTRACT_CREATE_MUTATION } from '../utils';
import { useRouter } from 'next/router';

type useContractCreateProps = {
  token?: string;
  user?: string;
};

const useContractCreate = ({ user, token }: useContractCreateProps) => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  const { mutate, mutateAsync, status, error, isLoading } = useMutation(
    async ({ ...args }: IContractCreate) => {
      const result = await client({ token, userId: user }).request(
        CONTRACT_CREATE_MUTATION,
        {
          contract: {
            user_id: user,
            ...args,
          },
        }
      );

      return _.first(_.get(result, 'data.insert_contracts.returning'));
    },
    {
      onSuccess: (data) => {
        // handle effects of changes here
        // invalidate the query so that the UI updates
        queryClient.invalidateQueries(['contractList']);
        queryClient.setQueryData(
          ['contractDetail', _.get(data, 'address')],
          data
        );

        setTimeout(() => {
          router.push(`/contracts/${_.get(data, 'address')}`);

          // signal to the user that the change was successful
          toast({
            title: 'Contract created.',
            status: 'success',
            duration: 9000,
            isClosable: true,
          });
        }, 200);
      },
      onError: () => {
        toast({
          title: 'Contract creation failed.',
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
      },
    }
  );

  return { mutate, mutateAsync, status, error, isLoading };
};

export default useContractCreate;
