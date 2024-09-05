"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Member } from "@/types/member";
import { signOut, useSession } from "next-auth/react";
import React, { useState } from "react";

type Props = {};

export default function OrganizationSelector({}: Props) {
  const { data: session, update } = useSession();

  const handleChangeOrganization = async (organizationId: string) => {
    await update({ selectedOrganizationId: organizationId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex items-center gap-1 ml-10">
          <Avatar>
            <AvatarImage src={session?.user.avatar} />
          </Avatar>
          <div className="flex flex-col">
            <p className="text-xs text-muted-foreground font-thin">Olá</p>
            <p className="text-lg font-semibold">{session?.user.name}</p>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent align="start" className="flex flex-col gap-2 py-2 px-3">
        <span className="font-semibold text-xs">
          Alterne entre suas organizações
        </span>
        <Select
          defaultValue={session?.selectedOrganizationId}
          onValueChange={handleChangeOrganization}
        >
          <SelectTrigger className="w-full">
            <SelectValue defaultValue={session?.selectedOrganizationId} />
          </SelectTrigger>
          <SelectContent>
            {session?.user.member_on.map((member: Member) => (
              <SelectItem
                key={member.organizationId}
                value={member.organizationId}
              >
                {member.organization.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          size={"sm"}
          onClick={() => {
            signOut();
          }}
        >
          Sair
        </Button>
      </PopoverContent>
    </Popover>
  );
}
