import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  siweCredentials,
  authorizeSiweMessage,
  extendSessionWithUserAndToken,
  encodeAuth,
  decodeAuth,
  CONFIG,
} from '../../../utils/auth';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

const siweProvider = CredentialsProvider({
  name: 'Ethereum',
  credentials: siweCredentials,
  authorize: (credentials, req: NextApiRequest) =>
    authorizeSiweMessage({ credentials, req }),
});

type NextAuthOptions = Parameters<typeof NextAuth>[2];

const Auth = async (req: NextApiRequest, res: NextApiResponse) => {
  const options: NextAuthOptions = {
    providers: [siweProvider],
    session: { strategy: 'jwt', maxAge: CONFIG.defaultMaxAge },
    jwt: { secret: NEXTAUTH_SECRET, encode: encodeAuth, decode: decodeAuth },
    callbacks: { session: extendSessionWithUserAndToken },
  };

  return await NextAuth(req, res, options);
};

export default Auth;
