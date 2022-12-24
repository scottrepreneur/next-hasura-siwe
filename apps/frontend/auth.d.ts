import 'next-auth';

declare module 'next-auth' {
  interface User {
    id?: string;
    address?: string;
  }

  // TODO try to fix this unknown type, not being found on JWT
  interface Session {
    token?: string;
    user?: User;
  }

  interface JWT {
    user: User;
  }
}
