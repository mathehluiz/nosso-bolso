import { httpClient } from "@/lib/http-client";
import { Transaction } from "@/types/transaction";

export const getPeriodTransactions = async (from: string, to: string) => {
  const response = await httpClient.get<Transaction[]>(
    `/transaction-report/period-transactions?from=${from}&to=${to}`
  );

  return response.data;
};
