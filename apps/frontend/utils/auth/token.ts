import _ from 'lodash';
import jwt from 'jsonwebtoken';
import { JWT, JWTDecodeParams } from 'next-auth/jwt';
import { Session } from 'next-auth';
import { CreateTokenParams, HasuraAuthToken } from '../../types';
import { getOrCreateUser } from './queryHelpers';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export const CONFIG = {
  encodingAlgorithm: 'HS256',
  defaultRoles: ['public'], // match HASURA_GRAPHQL_UNAUTHORIZED_ROLE
  defaultMaxAge: 30 * 60, // 30 minutes
};

// Could be swapped for different API models
export const createToken = ({
  user,
  token,
  maxAge,
  roles,
}: CreateTokenParams): HasuraAuthToken => ({
  ...token, // TODO look into saving address for sub?
  user: {
    address: _.get(token, 'sub'),
  },
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + (maxAge ?? CONFIG.defaultMaxAge),
  'https://hasura.io/jwt/claims': {
    'x-hasura-allowed-roles': roles ?? CONFIG.defaultRoles,
    'x-hasura-default-role': _.first(roles ?? CONFIG.defaultRoles),
    'x-hasura-role': _.first(roles ?? CONFIG.defaultRoles),
    'x-hasura-user-id': _.get(token, 'sub'),
  },
});

export const encodeToken = (token: object) =>
  jwt.sign(token, NEXTAUTH_SECRET, { algorithm: CONFIG.encodingAlgorithm });

export const encodeAuth = async ({
  token,
  maxAge,
}: {
  token?: HasuraAuthToken;
  maxAge?: number;
}) => {
  if (_.get(token, 'user')) return encodeToken(token);

  const user = await getOrCreateUser(_.get(token, 'sub'));

  return encodeToken(createToken({ user, token, maxAge }));
};

export const decodeToken = (token: string) =>
  jwt.verify(token, NEXTAUTH_SECRET, {
    algorithms: [CONFIG.encodingAlgorithm],
  });

export const decodeAuth = async ({ token }: JWTDecodeParams) =>
  decodeToken(token);

export const extendSessionWithUserAndToken = ({
  session,
  token,
}: {
  session: Session;
  token: JWT;
}) => ({
  ...session,
  user: token.user,
  token: encodeToken(token),
});
