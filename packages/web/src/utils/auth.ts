import GithubProvider from 'next-auth/providers/github';
import { getOrThrow } from '@/utils/getOrThrow';
import type { AuthOptions } from 'next-auth';

export const nextAuthOptions: AuthOptions = {
  // Configure one or more authentication providers
  jwt: {
    secret: getOrThrow('JWT_SIGNING_PRIVATE_KEY'),
  },
  providers: [
    GithubProvider({
      clientId: getOrThrow('GITHUB_ID'),
      clientSecret: getOrThrow('GITHUB_SECRET'),
    }),
    // ...add more providers here
  ],
  callbacks: {
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.sub } };
    },
  },
};
