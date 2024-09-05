import { getMe } from "@/services/users/get-me";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { email, password } = credentials;

        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          { email, password }
        );
        if (res.status === 401) return null;

        const { accessToken } = res.data;
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;

        const me = await getMe(accessToken);
        const selectedOrganizationId = me?.member_on[0]?.organizationId;

        return {
          user: me,
          accessToken,
          selectedOrganizationId,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...user, ...session };
      }

      return {
        ...token,
        ...user,
      };
    },

    async session({ token, session }) {
      session.accessToken = token.accessToken;
      session.selectedOrganizationId = token.selectedOrganizationId;
      session.user = token.user;

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${session.accessToken}`;

      return session;
    },
  },
  pages: {
    signIn: "/",
    newUser: "/users/new-user",
  },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 5 * 60 * 1000,
  },
};
