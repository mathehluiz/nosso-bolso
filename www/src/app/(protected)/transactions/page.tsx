"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getMonthTransactions } from "@/services/transaction/get-transactions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ListRestartIcon } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";
import { Transaction } from "@/types/transaction";
import CreateTransactionDrawer from "./_components/create-transaction-drawer";
import { Card } from "@/components/ui/card";
import UpdateTransactionDrawer from "./_components/update-transaction-drawer";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

type Props = {};

const months = [
  { id: 1, label: "janeiro" },
  { id: 2, label: "fevereiro" },
  { id: 3, label: "março" },
  { id: 4, label: "abril" },
  { id: 5, label: "maio" },
  { id: 6, label: "junho" },
  { id: 7, label: "julho" },
  { id: 8, label: "agosto" },
  { id: 9, label: "setembro" },
  { id: 10, label: "outubro" },
  { id: 11, label: "novembro" },
  { id: 12, label: "dezembro" },
];

export default function Transactions({}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const selectedMonth = parseInt(
    // @ts-ignore
    searchParams.get("month") ?? Number(new Date().getMonth().toString()) + 1
  );
  const selectedYear = parseInt(
    searchParams.get("year") || new Date().getFullYear().toString()
  );
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const {
    data: transactions,
    isLoading,
    isFetching,
  } = useQuery({
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

  const updateMonth = (month: number, year: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", month.toString());
    params.set("year", year.toString());
    router.push(`?${params.toString()}`);
  };

  const previousMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
  const previousYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;

  const nextMonth = selectedMonth === 12 ? 1 : selectedMonth + 1;
  const nextYear = selectedMonth === 12 ? selectedYear + 1 : selectedYear;

  const monthsToRender = [
    {
      month: previousMonth,
      year: previousYear,
      label: months[previousMonth - 1].label,
    },
    {
      month: selectedMonth,
      year: selectedYear,
      label: months[selectedMonth - 1].label,
    },
    { month: nextMonth, year: nextYear, label: months[nextMonth - 1].label },
  ];

  const groupedTransactions = transactions?.reduce((acc: any, transaction) => {
    if (!acc[transaction.date as any]) {
      acc[transaction.date as any] = [];
    }
    acc[transaction.date as any].push(transaction);
    return acc;
  }, {});

  const viewTransactions = Object.entries(groupedTransactions || {}).map(
    ([date, transactions]) => {
      return {
        date,
        transactions,
      };
    }
  );

  return (
    <div className="py-7 flex flex-col gap-3 px-5 relative">
      <div className="flex gap-1 ml-12 justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xs">transações</h1>
          <span className="font-semibold">fluxo de caixa</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={async () => {
              await queryClient.invalidateQueries({
                queryKey: [
                  "transactions",
                  selectedMonth,
                  selectedYear,
                  session?.selectedOrganizationId,
                ],
              });
            }}
          >
            <ListRestartIcon
              className={cn(
                "size-5",
                (isLoading || isFetching) && "animate-spin"
              )}
            />
          </Button>
        </div>
      </div>
      <div className="flex justify-between my-3">
        {monthsToRender.map(({ month, year, label }) => (
          <span
            key={`${year}-${month}`}
            className={`text-sm cursor-pointer p-2 rounded-full ${
              month === selectedMonth && year === selectedYear
                ? "font-bold text-green-500"
                : "hover:bg-green-200 transition-all duration-500"
            }`}
            onClick={() => updateMonth(month, year)}
          >
            {label}
          </span>
        ))}
      </div>
      <div className=" grid grid-cols-3 gap-2">
        <Card className="p-5 flex flex-col">
          <span className="text-xs">receitas</span>
          <span className="text-lg font-semibold text-green-500">
            {transactions
              ?.reduce((acc, transaction) => {
                if (transaction.type === "INCOME" && transaction.paid) {
                  acc += transaction.amount;
                }
                return acc;
              }, 0)
              .toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
          </span>
        </Card>
        <Card className="p-5 flex flex-col">
          <span className="text-xs">despesas</span>
          <span className="text-lg font-semibold text-red-500">
            {transactions
              ?.reduce((acc, transaction) => {
                if (transaction.type === "EXPENSE" && transaction.paid) {
                  acc += transaction.amount;
                }
                return acc;
              }, 0)
              .toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
          </span>
        </Card>
        <Card className="p-5 flex flex-col">
          <span className="text-xs">saldo</span>
          <span className="text-lg font-semibold">
            {transactions
              ?.reduce((acc, transaction) => {
                if (transaction.paid) {
                  if (transaction.type === "INCOME") {
                    acc += transaction.amount;
                  } else {
                    acc -= transaction.amount;
                  }
                }
                return acc;
              }, 0)
              .toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
          </span>
        </Card>
      </div>
      {isLoading &&
        !transactions &&
        Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-12 my-1" />
        ))}
      {transactions &&
        viewTransactions.map((transaction) => (
          <Card key={transaction.date} className="flex flex-col gap-3 p-3">
            <span className="text-xs font-medium text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString("pt-BR", {
                weekday: "long",
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
            <Separator />
            {(transaction.transactions as Transaction[]).map((transaction) => (
              <UpdateTransactionDrawer
                key={transaction.id}
                selectedMonth={selectedMonth}
                selectedYear={selectedYear}
                transaction={transaction}
              />
            ))}
          </Card>
        ))}
      <CreateTransactionDrawer />
    </div>
  );
}
