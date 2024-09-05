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
import { createTransaction } from "@/services/transaction/create-transaction";
import { PlusIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type Props = {};

export default function CreateTransactionDrawer({}: Props) {
  const handleCreateTransaction = async (values: TransactionFormSchema) => {
    try {
      await createTransaction(values);
      toast.success("Transação criada com sucesso");
    } catch (error) {
      toast.error("Erro ao criar transação");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-5 z-10 !py-6 right-[50%] transform translate-x-1/2 bg-green-500 rounded-xl">
          <PlusIcon className="size-8s " />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[80%]">
        <DrawerHeader>
          <DrawerTitle>Nova transação</DrawerTitle>
          <DrawerDescription>Insira os dados da transação</DrawerDescription>
        </DrawerHeader>
        <TransactionForm onSubmit={handleCreateTransaction}>
          <DrawerClose asChild>
            <Button type="submit" className="w-full mt-5">
              <PlusIcon className="size-5 mr-2" />
              Adicionar
            </Button>
          </DrawerClose>
        </TransactionForm>
      </DrawerContent>
    </Drawer>
  );
}
