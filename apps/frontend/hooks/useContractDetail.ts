import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { CONTRACT_DETAIL_QUERY, client } from '../utils';

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
    const result = await client({
      token,
      userId: _.get(user, 'address'),
    }).request(CONTRACT_DETAIL_QUERY, { address });

    return _.first(_.get(result, 'contracts'));
  };

  const { status, error, data, isLoading } = useQuery({
    queryKey: ['contractDetail', address],
    queryFn: contractDetailQueryResult,
    enabled: !!token && !!address,
  });

  return { status, error, data, isLoading };
};

export default useContractDetail;
