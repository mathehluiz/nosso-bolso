import BalanceCard from "@/components/dashboard/balance-card";

import { DollarSignIcon } from "lucide-react";
import React from "react";

type Props = { amount: number };

export default function ReceiptsCard({ amount }: Props) {
  return (
    <BalanceCard
      title="receitas"
      value={amount.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
      iconClassName="bg-green-100"
    >
      <DollarSignIcon className="w-6 h-6 stroke-green-400" />
    </BalanceCard>
  );
}
