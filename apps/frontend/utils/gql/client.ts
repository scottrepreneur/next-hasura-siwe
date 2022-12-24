import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const setLink = ({ token, userId }) => {
  const httpLink = new HttpLink({ uri: API_URL });

  const authLink = new ApolloLink((operation, forward) => {
    // Use the setContext method to set the HTTP headers.
    const headers = { authorization: null };
    if (token) {
      headers.authorization = `Bearer ${token}`;
      headers['x-hasura-user-id'] = userId;
    } else {
      headers['x-hasura-admin-secret'] =
        process.env.HASURA_GRAPHQL_ADMIN_SECRET;
    }

    operation.setContext({
      headers,
    });

    // Call the next link in the middleware chain.
    return forward(operation);
  });

  return authLink.concat(httpLink);
};

export const apolloClient = (token?: string, userId?: string) =>
  new ApolloClient({
    link: setLink({ token, userId }),
    cache: new InMemoryCache(),
  });
