import BalanceCard from "@/components/dashboard/balance-card";

import { DollarSignIcon } from "lucide-react";
import React from "react";

type Props = { value: number };

export default function ReceiptsCard({ value }: Props) {
  return (
    <BalanceCard
      title="receitas"
      value={new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(value)}
      iconClassName="bg-green-100"
    >
      <DollarSignIcon className="w-6 h-6 stroke-green-400" />
    </BalanceCard>
  );
}
