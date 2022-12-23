import { gql } from '@apollo/client';

export const USER_DETAIL_BY_ADDRESS_QUERY = gql`
  query userLookup($address: String) {
    users(where: { address: { _eq: $address } }) {
      id
      address
    }
  }
`;

export const USER_CREATE_MUTATION = gql`
  mutation createUser($address: String) {
    insert_users(objects: { address: $address }) {
      returning {
        id
        address
      }
    }
  }
`;
