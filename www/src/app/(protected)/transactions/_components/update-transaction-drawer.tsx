"use client";

import {
  TransactionForm,
  TransactionFormSchema,
} from "@/components/forms/transaction-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { deleteTransaction } from "@/services/transaction/delete-transaction";
import { updateTransaction } from "@/services/transaction/update-transaction";
import { Transaction } from "@/types/transaction";
import { PlusIcon, XIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import TransactionItem from "./transaction-item";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type Props = {
  transaction: Transaction;
  selectedMonth: number;
  selectedYear: number;
};

export default function UpdateTransactionDrawer({
  selectedMonth,
  selectedYear,
  transaction,
}: Props) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const handleUpdateTransaction = async (values: TransactionFormSchema) => {
    try {
      await updateTransaction(values);
      toast.success("Transação atualizada com sucesso");
      await queryClient.invalidateQueries({
        queryKey: [
          "transactions",
          selectedMonth,
          selectedYear,
          session?.selectedOrganizationId,
        ],
      });
    } catch (error) {
      toast.error("Erro ao atualizada transação");
    }
  };

  const handleDeleteTransaction = async () => {
    try {
      await deleteTransaction(transaction.id);
      toast.success("Transação deletada com sucesso");
      await queryClient.invalidateQueries({
        queryKey: [
          "transactions",
          selectedMonth,
          selectedYear,
          session?.selectedOrganizationId,
        ],
      });
    } catch (error) {
      toast.error("Erro ao deletar transação");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger className="flex py-2 w-full justify-between">
        <TransactionItem transaction={transaction} />
      </DrawerTrigger>
      <DrawerContent className="h-[85%]">
        <DrawerHeader>
          <DrawerTitle>{transaction.note}</DrawerTitle>
          <DrawerDescription>Insira os dados da transação</DrawerDescription>
        </DrawerHeader>
        <TransactionForm
          onSubmit={handleUpdateTransaction}
          defaultValues={transaction}
        >
          <div className="flex justify-between gap-5">
            <DrawerClose asChild>
              <Button
                type="button"
                variant={"secondary"}
                className="w-full mt-5"
                onClick={handleDeleteTransaction}
              >
                <XIcon className="size-5 mr-2" />
                Remover
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button type="submit" className="w-full mt-5">
                <PlusIcon className="size-5 mr-2" />
                Atualizar
              </Button>
            </DrawerClose>
          </div>
        </TransactionForm>
      </DrawerContent>
    </Drawer>
  );
}
