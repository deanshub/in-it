import GithubProvider from 'next-auth/providers/github';
import { getOrThrow } from '@/utils/getOrThrow';
import type { AuthOptions } from 'next-auth';
import dbConnect from '@/db/dbConnect';
import User from '@/db/models/User';
import { User as NextAuthDefaultUser } from 'next-auth';

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
        const { login: userNameInProvider, name, email, avatar_url } = profile;
        return {
          id: userNameInProvider,
          name: name ?? userNameInProvider,
          email: email,
          image: avatar_url,
        };
      },
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ account, user }) {
      const provider = account?.provider;
      const { id: userNameInProvider, name, email, image } = user;
      try {
        await dbConnect();

        await User.updateOne(
          { provider, userNameInProvider },
          {
            $set: {
              email,
              name,
              avatarUrl: image,
            },
            $setOnInsert: { provider, userNameInProvider, role: 'user' },
          },
          { upsert: true },
        );
      } catch (error) {
        console.error(error);
        return false;
      }

      return true;
    },
    async session({ session, token }) {
      return { ...session, user: { ...session.user, id: token.sub } };
    },
  },
};

export interface NextAuthUser extends NextAuthDefaultUser {
  id: string;
}
