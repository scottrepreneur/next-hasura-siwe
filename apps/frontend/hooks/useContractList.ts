import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { CONTRACT_LIST_QUERY, client, camelize } from '../utils';
import { IContract } from '../types';
import { User } from 'next-auth';

type useContractListProps = {
  token?: string;
  user?: Partial<User>;
};

const useContractList = ({ token, user }: useContractListProps) => {
  const contractListQueryResult = async () => {
    if (!token) return;

    const result = await client({
      token,
      userId: _.get(user, 'address'),
    }).request(CONTRACT_LIST_QUERY);

    return camelize(_.get(result, 'contracts'));
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
