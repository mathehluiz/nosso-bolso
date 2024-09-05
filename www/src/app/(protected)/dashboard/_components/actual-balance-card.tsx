import BalanceCard from "@/components/dashboard/balance-card";

import { PiggyBank } from "lucide-react";
import React from "react";

type Props = {
  amount: number;
};

export default function ActualBalanceCard({ amount }: Props) {
  return (
    <BalanceCard
      title="saldo atual"
      value={amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
      iconClassName="bg-gray-100"
      hideContent
    >
      <PiggyBank className="w-6 h-6 stroke-gray-400" />
    </BalanceCard>
  );
}
