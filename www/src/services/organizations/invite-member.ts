import { httpClient } from "@/lib/http-client";

export const inviteMember = async (email: string) => {
  await httpClient.post("/organization/invite", { email });
};
