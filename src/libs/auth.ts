import { NextAuthOptions } from 'next-auth';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { db } from './db';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { User } from '@/types/databaseTypes';
import { fetchRedis } from '@/helpers/redis';

export const authOptions: NextAuthOptions = {
	adapter: UpstashRedisAdapter(db),
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		}),
		GitHubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			const dbUserResult = (await fetchRedis(`get`, `user:${token.id}`)) as
				| string
				| null;

			if (!dbUserResult) {
				token.id = user!.id;
				return token;
			}

			const dbUser = JSON.parse(dbUserResult) as User;

			if (!dbUser) {
				token.id = user?.id;
				return token;
			}

			return {
				id: dbUser.id,
				name: dbUser?.name,
				email: dbUser.email,
				picture: dbUser.image,
			};
		},

		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name as string;
				session.user.email = token.email as string;
				session.user.image = token.picture as string;
			}

			return session;
		},
		redirect() {
			return '/dashboard';
		},
	},
};
