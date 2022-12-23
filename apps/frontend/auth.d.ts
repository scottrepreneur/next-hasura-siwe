import 'next-auth';

declare module 'next-auth' {
  interface User {
    address?: string;
  }

  interface Session {
    token?: string;
    user?: User;
  }
}
