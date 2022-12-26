/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { FieldErrorsImpl } from 'react-hook-form';

export * from './auth';
export * from './gql';
export * from './web3';

export const camelize = (obj: any) =>
  _.transform(obj, (acc: any, value: any, key: any, target: any) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key);

    acc[camelKey] = _.isObject(value) ? camelize(value) : value;
  });

export const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

export const getErrorMessage = (
  key: string,
  errors: Partial<FieldErrorsImpl>
) => {
  const message = errors[key].message;
  if (typeof message === 'string') {
    return message;
  }
  return null;
};
