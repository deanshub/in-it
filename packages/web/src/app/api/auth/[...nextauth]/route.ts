import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { getOrThrow } from '@/utils/getOrThrow';

const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: getOrThrow('GITHUB_ID'),
      clientSecret: getOrThrow('GITHUB_SECRET'),
    }),
    // ...add more providers here
  ],
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
