import BalanceCard from "@/components/dashboard/balance-card";

import { DollarSignIcon, WalletIcon } from "lucide-react";
import React from "react";

type Props = {
  amount: number;
};

export default function MyExpensesCard({ amount }: Props) {
  return (
    <BalanceCard
      title="meus gastos"
      value={amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
      iconClassName="bg-orange-100"
    >
      <WalletIcon className="w-6 h-6 stroke-orange-400" />
    </BalanceCard>
  );
}
