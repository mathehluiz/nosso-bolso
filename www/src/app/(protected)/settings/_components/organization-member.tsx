"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMembers } from "@/services/organizations/get-members";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { XIcon } from "lucide-react";
import React from "react";
import InviteMemberDialog from "./invite-member-dialog";
import { removeMember } from "@/services/organizations/remove-member";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function OrganizationMembers() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { data: members } = useQuery({
    queryKey: ["organization-members", session?.selectedOrganizationId],
    queryFn: async () => await getMembers(),
    refetchOnWindowFocus: false,
  });

  const handeRemoveMember = async (userId: string) => {
    try {
      await removeMember(userId);
      await queryClient.invalidateQueries({
        queryKey: ["organization-members", session?.selectedOrganizationId],
      });
      toast.success("Membro removido com sucesso");
    } catch (error) {
      toast.error("Erro ao remover membro");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between">
        <div className="flex flex-col">
          <CardTitle>Membros</CardTitle>
          <CardDescription>
            Gerêncie os membros de sua organização
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <InviteMemberDialog />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Função</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members?.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.user.avatar} />
                      <AvatarFallback>{member.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{member.user.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {member.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{member.user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{member.role}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant={"ghost"}
                    disabled={member.role === "OWNER"}
                    onClick={() => handeRemoveMember(member.userId)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
