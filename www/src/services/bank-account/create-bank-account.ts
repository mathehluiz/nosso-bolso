import { BankAccountFormSchema } from "@/components/forms/bank-account-form";
import { httpClient } from "@/lib/http-client";

export const createBankAccount = async (values: BankAccountFormSchema) => {
  const response = await httpClient.post("/bank-accounts", {
    ...values,
    ownerId: "d7707ec3-1487-4711-924c-dab03eb1c052",
    balance: 0,
  });
  return response.data;
};
