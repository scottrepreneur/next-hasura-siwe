import _ from 'lodash';
import { getCsrfToken } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import {
  SiweAuthorizeParams,
  SiweMessageAuthorizeParams,
  SiweCredentialParams,
} from '../../types';

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const NEXTAUTH_HOST = new URL(NEXTAUTH_URL).host;

const defaultCredential = { type: 'text', placeholder: '0x0' };
export const siweCredentials = {
  message: { label: 'Message', ...defaultCredential },
  signature: { label: 'Signature', ...defaultCredential },
};

const parseCredentials = ({ credentials, req }: SiweAuthorizeParams) => {
  const siwe = new SiweMessage(JSON.parse(_.get(credentials, 'message', '{}')));
  return Promise.resolve({ siwe, credentials, req });
};

const checkNonce = async ({
  siwe,
  credentials,
  req,
}: SiweMessageAuthorizeParams) => {
  return getCsrfToken({ req }).then((nonce: string) => {
    if (!_.eq(_.get(siwe, 'nonce'), nonce)) {
      return Promise.reject({ error: 'Invalid nonce' });
    }
    return Promise.resolve({ siwe, credentials, req });
  });
};

const checkDomain = ({
  siwe,
  credentials,
}: SiweCredentialParams): Promise<SiweCredentialParams> => {
  if (!_.eq(_.get(siwe, 'domain'), NEXTAUTH_HOST)) {
    return Promise.reject({ error: 'Invalid domain' });
  }
  return Promise.resolve({ siwe, credentials });
};

const checkSignature = ({
  siwe,
  credentials,
}: SiweCredentialParams): Promise<SiweCredentialParams> =>
  siwe
    .validate(_.get(credentials, 'signature', ''))
    .then(() => Promise.resolve({ siwe, credentials }))
    .catch((error: Error) => {
      console.log(error);
      return Promise.reject({ error: 'Invalid signature' });
    });

export const authorizeSiweMessage = (
  data: SiweAuthorizeParams
): Promise<{ id?: string } | { error: string }> =>
  parseCredentials(data)
    .then((data) => checkNonce(data))
    .then((data) => checkDomain(data))
    .then((data) => checkSignature(data))
    .then(({ siwe }) => {
      console.log('siwe', siwe);
      return { id: _.toLower(_.get(siwe, 'address')) };
    })
    .catch((e) => {
      console.log(e);
      return { error: 'Invalid credentials' };
    });
