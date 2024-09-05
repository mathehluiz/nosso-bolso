import { httpClient } from "@/lib/http-client";

export const deleteTransaction = async (id: string) => {
  const response = await httpClient.delete(`/transactions/${id}`);
  return response.data;
};
