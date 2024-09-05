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
import { createBankAccount } from "@/services/bank-account/create-bank-account";
import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { toast } from "sonner";

export default function CreateBankAccountDrawer() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const handleCreateAccount = async (values: BankAccountFormSchema) => {
    try {
      await createBankAccount(values);
      queryClient.invalidateQueries({
        queryKey: ["bank-accounts", session?.selectedOrganizationId],
      });
      toast.success("Conta bancária criada com sucesso");
    } catch (error) {
      toast.error("Erro ao criar conta bancária");
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="-mt-3 !p-0">
          <PlusIcon className="w-6 h-6 text-green-400 " />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-[35%] px-5">
        <DrawerHeader>
          <DrawerTitle>Adicionar conta bancária</DrawerTitle>
        </DrawerHeader>
        <BankAccountForm onSubmit={handleCreateAccount}>
          <DrawerClose asChild>
            <Button type="submit" className="w-full">
              <PlusIcon className="w-4 h-4 mr-2" /> Adicionar{" "}
            </Button>
          </DrawerClose>
        </BankAccountForm>
      </DrawerContent>
    </Drawer>
  );
}
