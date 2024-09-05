import { httpClient } from "@/lib/http-client";
import { BankAccount } from "@/types/bank-account";

export const getBankAccounts = async () => {
  const response = await httpClient.get<BankAccount[]>("/bank-accounts");
  return response.data;
};
