import { httpClient } from "@/lib/http-client";
import { Transaction } from "@/types/transaction";

export const getMonthTransactions = async (month: number, year: number) => {
  const formattedMonth = month < 10 ? `0${month}` : month;
  const response = await httpClient.get<Transaction[]>(
    `/transaction-report/month-transactions?date=${year}-${formattedMonth}-01T03:00:00`
  );
  return response.data;
};
