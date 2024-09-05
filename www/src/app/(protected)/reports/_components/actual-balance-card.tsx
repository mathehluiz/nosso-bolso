import BalanceCard from "@/components/dashboard/balance-card";

import { PiggyBank } from "lucide-react";
import React from "react";

type Props = {
  value: number;
};

export default function ActualBalanceCard({ value }: Props) {
  return (
    <BalanceCard
      title="saldo atual"
      value={new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value)}
      iconClassName="bg-gray-100"
      hideContent
    >
      <PiggyBank className="w-6 h-6 stroke-gray-400" />
    </BalanceCard>
  );
}
