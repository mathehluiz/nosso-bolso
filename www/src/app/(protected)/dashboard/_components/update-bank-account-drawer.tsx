import {
  BankAccountForm,
  BankAccountFormSchema,
} from "@/components/forms/bank-account-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { deleteBankAccount } from "@/services/bank-account/delete-bank-account";
import { updateBankAccount } from "@/services/bank-account/update-bank-account";
import { BankAccount } from "@/types/bank-account";
import { useQueryClient } from "@tanstack/react-query";
import { EditIcon, XIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

type Props = {
  bankAccount: BankAccount;
};

export default function UpdateBankAccountDrawer({ bankAccount }: Props) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const handleUpdateBankAccount = async (values: BankAccountFormSchema) => {
    try {
      await updateBankAccount(values);
      await queryClient.invalidateQueries({
        queryKey: ["bank-accounts", session?.selectedOrganizationId],
      });
      toast.success("Conta bancária atualizada com sucesso");
    } catch (error) {
      toast.error("Erro ao atualizar conta bancária");
    }
  };

  const handleDeleteBankAccount = async () => {
    try {
      await deleteBankAccount(bankAccount.id);
      await queryClient.invalidateQueries({
        queryKey: ["bank-accounts", session?.selectedOrganizationId],
      });
      toast.success("Conta bancária removida com sucesso");
    } catch (error) {
      toast.error("Erro ao remover conta bancária");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <div className="flex w-full my-1 justify-between">
          <div className="flex gap-2 items-center">
            <Image src={"/wallet.svg"} width={50} height={50} alt="wallet" />
            <span>{bankAccount.name}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">saldo de</span>
            <span className="font-medium">
              {bankAccount.balance.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </span>
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="h-[45%] px-5">
        <DrawerHeader>
          <DrawerTitle>{bankAccount.name}</DrawerTitle>
        </DrawerHeader>
        <BankAccountForm
          defaultValues={bankAccount}
          onSubmit={handleUpdateBankAccount}
        >
          <div className="flex justify-between gap-8">
            <DrawerClose asChild>
              <Button
                type="button"
                onClick={handleDeleteBankAccount}
                variant={"secondary"}
                className="w-full"
              >
                <XIcon className="w-4 h-4 mr-2" /> Remover
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button type="submit" className="w-full">
                <EditIcon className="w-4 h-4 mr-2" /> Atualizar
              </Button>
            </DrawerClose>
          </div>
        </BankAccountForm>
      </DrawerContent>
    </Drawer>
  );
}
