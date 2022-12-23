import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { CONTRACT_DETAIL_QUERY, apolloClient } from '../utils';

type useContractDetailProps = {
  token?: string;
  address?: string;
  user?: { address: string };
};

const useContractDetail = ({
  token,
  address,
  user,
}: useContractDetailProps) => {
  const contractDetailQueryResult = async () => {
    const result = await apolloClient(token, _.get(user, 'address')).query({
      query: CONTRACT_DETAIL_QUERY,
      variables: { address },
    });

    return _.first(_.get(result, 'data.contracts'));
  };

  const { status, error, data, isLoading } = useQuery({
    queryKey: ['contractDetail', address],
    queryFn: contractDetailQueryResult,
    enabled: !!token && !!address,
  });

  return { status, error, data, isLoading };
};

export default useContractDetail;
