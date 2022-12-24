import { gql } from 'graphql-request';

export const USER_DETAIL_BY_ADDRESS_QUERY = gql`
  query userLookup($address: String) {
    users(where: { address: { _eq: $address } }) {
      address
    }
  }
`;

export const USER_CREATE_MUTATION = gql`
  mutation createUser($address: String) {
    insert_users(objects: { address: $address }) {
      returning {
        address
      }
    }
  }
`;

export const CONTRACT_LIST_QUERY = gql`
  query contractList {
    contracts {
      name
      address
      chain_id
    }
  }
`;

export const CONTRACT_DETAIL_QUERY = gql`
  query contractDetail($address: String) {
    contracts(where: { address: { _eq: $address } }) {
      name
      address
      chain_id
    }
  }
`;

export const CONTRACT_CREATE_MUTATION = gql`
  mutation createContract($contract: contracts_insert_input!) {
    insert_contracts(objects: [$contract]) {
      returning {
        name
        address
        chain_id
      }
    }
  }
`;
