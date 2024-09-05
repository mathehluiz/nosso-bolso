import { options } from "@/app/api/auth/[...nextauth]/options";
import axios from "axios";
import { getServerSession } from "next-auth";
import { getSession } from "next-auth/react";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.request.use(
  async (config) => {
    if (!config.headers.Authorization) {
      let session = await getSession();
      if (session) {
        if (session.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        if (session.selectedOrganizationId) {
          config.headers["x-org-id"] = session.selectedOrganizationId;
        }
        return config;
      }

      session = await getServerSession(options);
      if (session) {
        if (session.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        if (session.selectedOrganizationId) {
          config.headers["x-org-id"] = session.selectedOrganizationId;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
