import { GraphQLClient } from 'graphql-request';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ClientParams = {
  token?: string;
  userId?: string;
};

export const client = ({ token, userId }: ClientParams) => {
  const headers = { authorization: null };

  if (token) {
    headers.authorization = `Bearer ${token}`;

    // * Set matching session variables for Hasura where needed
    headers['x-hasura-user-id'] = userId;
  } else {
    headers['x-hasura-admin-secret'] = process.env.HASURA_GRAPHQL_ADMIN_SECRET;
  }

  return new GraphQLClient(API_URL, { headers });
};
