import { JWT } from "next-auth/jwt";
import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    selectedOrganizationId: string;
    user: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    selectedOrganizationId: string;
  }
}
