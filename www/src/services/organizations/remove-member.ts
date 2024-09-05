import { httpClient } from "@/lib/http-client";

export const removeMember = async (userId: string) => {
  await httpClient.post("/organization/remove-member", { userId });
};
