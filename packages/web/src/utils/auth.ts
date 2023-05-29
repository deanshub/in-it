import GithubProvider from 'next-auth/providers/github';
import { getOrThrow } from '@/utils/getOrThrow';
import type { AuthOptions } from 'next-auth';
import dbConnect from '@/db/dbConnect';
import User from '@/db/models/User';
import { getUserFilterByProvider } from '@/db/queries';
import { SourceCodeProvider } from 'in-it-shared-types';

export const nextAuthOptions: AuthOptions = {
  // Configure one or more authentication providers
  jwt: {
    secret: getOrThrow('JWT_SIGNING_PRIVATE_KEY'),
  },
  providers: [
    GithubProvider({
      clientId: getOrThrow('GITHUB_ID'),
      clientSecret: getOrThrow('GITHUB_SECRET'),
      profile(profile) {
        const { login, name, email, avatar_url } = profile;
        return {
          id: login,
          name: name ?? login,
          email: email,
          image: avatar_url,
        };
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      const { sub, provider } = token;

      return { ...session, user: { ...session.user, id: sub, provider } };
    },
  },
  events: {
    async signIn({ user, account }) {
      const provider = account?.provider as SourceCodeProvider;
      const { id, name, email, image } = user;

      try {
        await dbConnect();

        await User.updateOne(
          { githubUsername: id },
          {
            $set: {
              email,
              name,
              avatarUrl: image,
            },
            $setOnInsert: getUserFilterByProvider(provider!, id, { role: 'user' }),
          },
          { upsert: true },
        );
      } catch (error) {
        console.error(error);
      }
    },
  },
};
