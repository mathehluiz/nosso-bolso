import { BankAccountFormSchema } from "@/components/forms/bank-account-form";
import { httpClient } from "@/lib/http-client";

export const updateBankAccount = async (values: BankAccountFormSchema) => {
  const { ownerId, balance, id, ...rest } = values;
  const response = await httpClient.patch(`/bank-accounts/${id}`, rest);
  return response.data;
};
