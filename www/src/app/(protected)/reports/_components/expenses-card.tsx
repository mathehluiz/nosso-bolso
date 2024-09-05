import BalanceCard from "@/components/dashboard/balance-card";

import { DollarSignIcon } from "lucide-react";
import React from "react";

type Props = {
  value: number;
};

export default function ExpensesCard({ value }: Props) {
  return (
    <BalanceCard
      title="despesas"
      value={new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value)}
      iconClassName="bg-red-100"
    >
      <DollarSignIcon className="w-6 h-6 stroke-red-400" />
    </BalanceCard>
  );
}
