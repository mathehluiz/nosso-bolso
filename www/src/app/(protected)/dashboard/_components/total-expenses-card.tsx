import BalanceCard from "@/components/dashboard/balance-card";

import { BanknoteIcon } from "lucide-react";
import React from "react";

type Props = {
  amount: number;
};

export default function TotalExpensesCard({ amount }: Props) {
  return (
    <BalanceCard
      title="gastos totais"
      value={amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
      iconClassName="bg-red-100"
    >
      <BanknoteIcon className="w-6 h-6 stroke-red-400" />
    </BalanceCard>
  );
}
