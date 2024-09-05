import { BankAccount } from "./bank-account";
import { Category } from "./category";

export type Transaction = {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  note: string;
  date: Date;
  paid: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
  createdById: string;
  categoryId: string;
  bankAccountId: string;
  recurringScheduleId: any;
  organizationId: string;
  category: Category;
  bank_account: BankAccount;
  created_by: {
    id: string;
    name: string;
    avatar: string;
  };
};
