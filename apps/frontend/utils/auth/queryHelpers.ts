import _ from 'lodash';
import { isAddress } from '@ethersproject/address';
import {
  apolloClient,
  USER_CREATE_MUTATION,
  USER_DETAIL_BY_ADDRESS_QUERY,
} from '../gql';
import { IUser } from '../../types';

const fetchExistingUser = async (address: string): Promise<IUser | null> =>
  apolloClient()
    .query({
      query: USER_DETAIL_BY_ADDRESS_QUERY,
      variables: { address: _.toLower(address) },
    })
    .then((res) => {
      if (!_.isEmpty(_.get(res, 'data.users'))) {
        return Promise.resolve(_.first(_.get(res, 'data.users')));
      }
      return Promise.resolve(null);
    })
    .catch((error) => {
      console.log(error);
      return Promise.reject(error);
    });

const createNewUser = async (address: string): Promise<IUser | null> =>
  apolloClient()
    .mutate({
      mutation: USER_CREATE_MUTATION,
      variables: { address: _.toLower(address) },
    })
    .then((res) => {
      if (_.get(res, 'data.insert_users.returning')) {
        return Promise.resolve(_.get(res, 'data.insert_users.returning'));
      }
      return Promise.resolve(null);
    })
    .catch((error) => {
      console.log(error);
      return Promise.reject(error);
    });

export const getOrCreateUser = async (address: string): Promise<IUser> => {
  if (!address || !isAddress(address)) {
    throw new Error('No address provided');
  }
  return fetchExistingUser(address).then((existingUser: IUser) => {
    if (existingUser) {
      return Promise.resolve(existingUser);
    }
    return createNewUser(address).then((newUser: IUser) => {
      if (newUser) {
        return Promise.resolve(newUser);
      }
      return Promise.reject('Could not create user');
    });
  });
};
