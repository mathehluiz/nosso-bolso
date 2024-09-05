import BalanceCard from "@/components/dashboard/balance-card";

import { DollarSignIcon } from "lucide-react";
import React from "react";

type Props = {
  amount: number;
};

export default function ExpensesCard({ amount }: Props) {
  return (
    <BalanceCard
      title="despesas"
      value={amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
      iconClassName="bg-red-100"
    >
      <DollarSignIcon className="w-6 h-6 stroke-red-400" />
    </BalanceCard>
  );
}
