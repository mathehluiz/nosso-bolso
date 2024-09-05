import { httpClient } from "@/lib/http-client";

export const updateTransaction = async (values: any) => {
  const { id, ...transactionData } = values;
  const response = await httpClient.patch(
    `/transactions/${id}`,
    transactionData
  );
  return response.data;
};
