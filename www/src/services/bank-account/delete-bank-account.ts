import { httpClient } from "@/lib/http-client";

export const deleteBankAccount = async (id: string) => {
  await httpClient.delete(`/bank-accounts/${id}`);
};
