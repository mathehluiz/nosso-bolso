"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LandmarkIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getBankAccounts } from "@/services/bank-account/get-bank-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import CreateBankAccountDrawer from "./create-bank-account-drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import UpdateBankAccountDrawer from "./update-bank-account-drawer";
import { useSession } from "next-auth/react";

type Props = {};

export default function AccountsCard({}: Props) {
  const { data: session } = useSession();
  const { data: bankAccounts, isLoading } = useQuery({
    queryKey: ["bank-accounts", session?.selectedOrganizationId],
    queryFn: async () => await getBankAccounts(),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return (
    <Card className="border-none shadow-sm mt-5 py-5 flex flex-col">
      <div className="flex justify-between px-5 items-start">
        <div className="flex gap-2">
          <LandmarkIcon className="w-5 h-5" />
          <span>
            minhas <span className="font-bold text-green-600">contas</span>
          </span>
        </div>
        <CreateBankAccountDrawer />
      </div>
      <Separator className="w-11/12 self-center my-2" />
      <ScrollArea className="flex flex-col gap-2 px-5 h-52 py-3">
        {isLoading &&
          !bankAccounts &&
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-16 my-2" />
          ))}
        {bankAccounts?.map((bankAccount) => (
          <UpdateBankAccountDrawer
            key={bankAccount.id}
            bankAccount={bankAccount}
          />
        ))}
      </ScrollArea>
    </Card>
  );
}
