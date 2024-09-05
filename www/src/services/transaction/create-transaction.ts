import { TransactionFormSchema } from "@/components/forms/transaction-form";
import { httpClient } from "@/lib/http-client";

export const createTransaction = async (values: TransactionFormSchema) => {
  const response = await httpClient.post("/transactions", values);
  return response.data;
};
