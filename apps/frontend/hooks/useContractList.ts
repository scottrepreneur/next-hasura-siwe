import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { CONTRACT_LIST_QUERY, apolloClient, camelize } from '../utils';
import { IContract } from '../types';

type useContractListProps = {
  token?: string;
  user?: { address: string };
};

const useContractList = ({ token, user }: useContractListProps) => {
  const contractListQueryResult = async () => {
    if (!token) return;

    const result = await apolloClient(token, _.get(user, 'address')).query({
      query: CONTRACT_LIST_QUERY,
    });

    return camelize(_.get(result, 'data.contracts'));
  };

  const { status, error, data, isLoading } = useQuery<
    Array<Partial<IContract>>,
    Error
  >({
    queryKey: ['contractList'],
    queryFn: contractListQueryResult,
    enabled: !!token,
  });

  return { status, error, data, isLoading };
};

export default useContractList;
