import { httpClient } from "@/lib/http-client";
import { Member } from "@/types/member";

export const getMembers = async () => {
  const { data } = await httpClient.get<Member[]>("/organization/members");

  return data;
};
