import { JWT } from 'next-auth/jwt';
import { NextApiRequest } from 'next';
import { SiweMessage } from 'siwe';

// camelized version of DB columns

export interface IUser {
  id: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

// AUTH

export type CreateTokenParams = {
  user: IUser;
  token: JWT;
  maxAge?: number;
  roles?: string[];
};

export type HasuraAuthToken = {
  sub?: string;
  user?: {
    id?: string;
    address?: string;
  };
  iat?: number;
  exp?: number;
  'https://hasura.io/jwt/claims'?: {
    'x-hasura-allowed-roles': string[];
    'x-hasura-default-role': string;
    'x-hasura-role': string;
    'x-hasura-user-id': string;
  };
};

export type SiweAuthorizeParams = {
  credentials: Record<'message' | 'signature', string>;
  req: NextApiRequest;
};

export type SiweMessageAuthorizeParams = {
  siwe: SiweMessage;
} & SiweAuthorizeParams;

export type SiweCredentialParams = {
  siwe: SiweMessage;
  credentials: Record<'message' | 'signature', string>;
};
