"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InviteMemberForm,
  InviteMemberFormSchema,
} from "@/components/forms/invite-member-form";
import { toast } from "sonner";
import { inviteMember } from "@/services/organizations/invite-member";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

type Props = {};

export default function InviteMemberDialog({}: Props) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const onSubmit = async (values: InviteMemberFormSchema) => {
    try {
      await inviteMember(values.email);
      toast.success("Membro adicionado com sucesso");
      await queryClient.invalidateQueries({
        queryKey: ["organization-members", session?.selectedOrganizationId],
      });
    } catch (error) {
      toast.error("Erro ao adicionar membro");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"sm"}>Adicionar membros</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar membros</DialogTitle>
          <DialogDescription>
            Adicione membros a sua organização
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          <InviteMemberForm onSubmit={onSubmit}>
            <DialogClose asChild>
              <Button type="submit">Adicionar</Button>
            </DialogClose>
          </InviteMemberForm>
        </div>
      </DialogContent>
    </Dialog>
  );
}
