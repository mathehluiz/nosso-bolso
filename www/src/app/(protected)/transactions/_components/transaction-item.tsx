"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Transaction } from "@/types/transaction";
import React from "react";

type Props = {
  transaction: Transaction;
};

export default function TransactionItem({ transaction }: Props) {
  return (
    <>
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage src={transaction.created_by.avatar} />
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-start">{transaction.note}</span>
          <div className="flex gap-2 items-center">
            <span className="text-xs uppercase ">
              {transaction.category.name}
            </span>
            <span className="rounded-full w-1 h-1 bg-green-600" />
            <span
              className={cn(
                "text-xs",
                transaction.paid ? "text-green-600" : "text-red-600"
              )}
            >
              {transaction.paid
                ? transaction.type === "INCOME"
                  ? "recebida"
                  : "pendente"
                : transaction.type === "EXPENSE"
                ? "paga"
                : "pendente"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span
          className={cn(
            "text-sm font-semibold",
            transaction.type === "INCOME" ? "text-green-600" : "text-red-600"
          )}
        >
          {transaction.amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
        <span className="text-xs font-medium">
          {transaction.bank_account.name}
        </span>
      </div>
    </>
  );
}
