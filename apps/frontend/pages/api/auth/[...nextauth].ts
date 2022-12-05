import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import jwt from 'jsonwebtoken';
import { gql } from '@apollo/client';
import {
  apolloClient,
  userLookupQuery,
  createUserMutation,
} from '../../../utils/graphql';

export default async function auth(req: any, res: any) {
  const providers = [
    CredentialsProvider({
      name: 'Ethereum',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0',
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0',
        },
      },
      async authorize(credentials) {
        try {
          const siwe = new SiweMessage(
            JSON.parse(credentials?.message || '{}')
          );

          const nextAuthUrl = process.env.NEXTAUTH_URL;

          const nextAuthHost = new URL(nextAuthUrl).host;
          if (siwe.domain !== nextAuthHost) {
            return null;
          }

          if (siwe.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          await siwe.validate(credentials?.signature || '');
          return {
            // id gets set as sub in the token
            id: siwe.address,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const authSecret = process.env.NEXTAUTH_SECRET;

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: 'jwt',
      maxAge: 60 * 30,
    },
    jwt: {
      secret: authSecret,
      encode: async ({ secret, token, maxAge }: any) => {
        if (token.id) return jwt.sign(token, secret, { algorithm: 'HS256' });
        let userId = '';

        try {
          const address = token.sub.toLowerCase();
          const lookupUserResult = await apolloClient().query({
            query: userLookupQuery,
            variables: { address },
          });

          if (lookupUserResult?.data?.users?.length > 0) {
            userId = lookupUserResult.data.users[0]?.id;
          } else {
            const createUserResult = await apolloClient().mutate({
              mutation: createUserMutation,
              variables: {
                address,
              },
            });
            if (createUserResult?.data?.insert_users?.returning) {
              userId = createUserResult.data.insert_users.returning.id;
            }
          }
        } catch (error) {
          console.log(error);
          throw new Error("Couldn't find or create user");
        }
        const jwtClaims = {
          sub: token.sub,
          id: userId,
          address: token.sub,

          iat: Date.now() / 1000,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          'https://hasura.io/jwt/claims': {
            'x-hasura-allowed-roles': ['public'],
            'x-hasura-default-role': 'public',
            'x-hasura-role': 'public',
            'x-hasura-user-id': userId,
          },
        };
        const encodedToken = jwt.sign(jwtClaims, secret, {
          algorithm: 'HS256',
        });

        return encodedToken;
      },
      decode: async (params) => {
        const { secret, token }: any = params;
        const decodedToken: any = jwt.verify(token, secret, {
          algorithms: ['HS256'],
        });
        return decodedToken;
      },
    },
    callbacks: {
      async session({ session, token }: { session: any; token: any }) {
        session.user = {
          id: token.id,
          address: token.sub,
        };
        session.token = jwt.sign(token, authSecret, { algorithm: 'HS256' });

        return session;
      },
    },
  });
}
