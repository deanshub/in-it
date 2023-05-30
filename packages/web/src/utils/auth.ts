import GithubProvider from 'next-auth/providers/github';
import { getOrThrow } from '@/utils/getOrThrow';
import type { AuthOptions } from 'next-auth';
import dbConnect from '@/db/dbConnect';
import { upsertUserByProvider } from '@/db/queries';
import { SourceCodeProvider } from 'in-it-shared-types';
import { getNullAsUndefined } from './getNullAsUndefined';

export const nextAuthOptions: AuthOptions = {
  // Configure one or more authentication providers
  jwt: {
    secret: getOrThrow('JWT_SIGNING_PRIVATE_KEY'),
  },
  providers: [
    GithubProvider({
      clientId: getOrThrow('GITHUB_ID', 'GITHUB_ID'),
      clientSecret: getOrThrow('GITHUB_SECRET', 'GITHUB_SECRET'),
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
    async jwt({ token, account, user }) {
      if (account && user) {
        const { id: username, name, email, image } = user;
        const { provider } = account;

        await dbConnect();

        let dbUser;
        try {
          dbUser = await upsertUserByProvider(email!, provider as SourceCodeProvider, username, {
            name: getNullAsUndefined(name),
            avatarUrl: getNullAsUndefined(image),
          });
        } catch (e) {
          console.error(`Error upserting user. email: ${email}, provider: ${provider}`, e);
        }

        token.dbUserId = dbUser?._id;
        token.provider = provider;
      }
      return token;
    },
    async session({ session, token }) {
      const { sub, provider, dbUserId } = token;

      return { ...session, user: { ...session.user, id: sub, provider, dbUserId } };
    },
  },
};
