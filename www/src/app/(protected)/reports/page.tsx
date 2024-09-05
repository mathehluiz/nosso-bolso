"use client";

import React, { useState } from "react";
import { getMonthTransactions } from "@/services/transaction/get-transactions";
import { useQuery } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import { getPeriodTransactions } from "@/services/transaction/get-period-transactions";
import ReceiptsCard from "./_components/receipts-card";
import ExpensesCard from "./_components/expenses-card";
import ActualBalanceCard from "./_components/actual-balance-card";
import GeneralProjection from "./_components/general-projection";
import { ExpensesByCategoryCard } from "./_components/expenses-by-category";
import { TransactionsByBankAccount } from "./_components/transactions-by-bank-accoun";
import { useSession } from "next-auth/react";

type Props = {};

export default function Reports({}: Props) {
  const { data: session } = useSession();
  const [date, _] = React.useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 30),
  });

  const { data: transactions } = useQuery({
    queryKey: [
      "transactions",
      date?.from,
      date?.to,
      session?.selectedOrganizationId,
    ],
    queryFn: () =>
      getPeriodTransactions(date.from?.toISOString()!, date.to?.toISOString()!),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const incomes =
    transactions
      ?.filter((transaction) => transaction.type === "INCOME")
      .reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0;
  const expenses =
    transactions
      ?.filter((transaction) => transaction.type === "EXPENSE")
      .reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0;
  const total = incomes && expenses ? incomes - expenses : 0;

  return (
    <div className="py-7 flex flex-col gap-3 px-5 relative w-full">
      <div className="flex gap-1 ml-12 justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xs">relatório</h1>
          <span className="font-semibold">detalhado</span>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full pt-5">
        <h1 className="px-2">
          visão <span className="font-bold">geral</span>
        </h1>
        <div className="flex flex-col gap-2">
          <ActualBalanceCard value={total ?? 0} />
          <div className="grid grid-cols-2 gap-2">
            <ReceiptsCard value={incomes} />
            <ExpensesCard value={expenses} />
          </div>
        </div>
        <div className="flex flex-col xl:flex-row gap-2">
          <GeneralProjection incomes={incomes} expenses={expenses} />
          <ExpensesByCategoryCard transactions={transactions ?? []} />
          <TransactionsByBankAccount transactions={transactions ?? []} />
        </div>
      </div>
    </div>
  );
}
