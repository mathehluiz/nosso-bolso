import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import React from "react";

type Props = {
  incomes: number;
  expenses: number;
};

export default function GeneralProjection({ incomes, expenses }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projeção Geral</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Receitas</p>
            <p className="text-lg font-semibold text-green-500">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(incomes)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Despesas</p>
            <p className="text-lg font-semibold text-red-500">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(expenses)}
            </p>
          </div>
        </div>
        <Progress
          value={(incomes / (incomes + expenses)) * 100}
          className={"bg-red-500"}
        />
      </CardContent>
    </Card>
  );
}
