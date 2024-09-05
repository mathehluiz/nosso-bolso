"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import MonthSelector from "./_components/month-selector";
import ActualBalanceCard from "./_components/actual-balance-card";
import ReceiptsCard from "./_components/receipts-card";
import ExpensesCard from "./_components/expenses-card";
import MyExpensesCard from "./_components/my-expenses-card";
import TotalExpensesCard from "./_components/total-expenses-card";
import AccountsCard from "./_components/accounts-card";
import CategoriesCard from "./_components/categories-card";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMonthTransactions } from "@/services/transaction/get-transactions";
import OrganizationSelector from "./_components/organization-selector";

type Props = {};

export default function Dashboard({}: Props) {
  const [date, setDate] = useState<Date>(new Date());
  const { data: session } = useSession();

  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedMonth = parseInt(
    // @ts-ignore
    searchParams.get("month") ?? Number(new Date().getMonth().toString()) + 1
  );
  const selectedYear = parseInt(
    searchParams.get("year") || new Date().getFullYear().toString()
  );

  const { data: transactions } = useQuery({
    queryKey: [
      "transactions",
      selectedMonth,
      selectedYear,
      session?.selectedOrganizationId,
    ],
    queryFn: () => getMonthTransactions(selectedMonth, selectedYear),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const handleChangeDate = (date: Date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    router.push(`/dashboard?month=${month}&year=${year}`);
    setDate(date);
  };

  const actualBalance = transactions?.reduce(
    (acc, transaction) => {
      if (transaction.type === "INCOME") {
        acc.incomes += transaction.amount;
      } else {
        acc.expenses += transaction.amount;
      }
      return acc;
    },
    { incomes: 0, expenses: 0 }
  );

  return (
    <div className="py-4 flex flex-col gap-3">
      <OrganizationSelector />
      <MonthSelector date={date} setDate={handleChangeDate} />
      <div className="flex flex-col gap-2">
        <ActualBalanceCard
          amount={actualBalance?.incomes! - actualBalance?.expenses! ?? 0}
        />
        <div className="grid grid-cols-2 gap-2">
          <ReceiptsCard amount={actualBalance?.incomes! ?? 0} />
          <ExpensesCard amount={actualBalance?.expenses! ?? 0} />
          <MyExpensesCard
            amount={
              transactions
                ?.filter(
                  (transaction) => transaction.createdById === session?.user.id
                )
                .reduce((acc, transaction) => acc + transaction.amount, 0) ?? 0
            }
          />
          <TotalExpensesCard
            amount={
              transactions?.reduce(
                (acc, transaction) => acc + transaction.amount,
                0
              ) ?? 0
            }
          />
        </div>
      </div>
      <AccountsCard />
      <CategoriesCard />
    </div>
  );
}
