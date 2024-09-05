"use client";

import React, { useState } from "react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  hideContent?: boolean;
  children?: React.ReactNode;
  title: string;
  value: string;
  iconClassName: string;
};

export default function BalanceCard({
  hideContent,
  children,
  title,
  value,
  iconClassName,
}: Props) {
  const [isHidden, setIsHidden] = useState(false);
  return (
    <Card className="w-full px-3 py-2 flex items-center justify-between border-none shadow-sm">
      <div className="flex gap-2 w-full items-center">
        <div
          className={cn(
            "rounded-md p-1 w-10 h-10 flex items-center justify-center",
            iconClassName
          )}
        >
          {children}
        </div>
        <div className="flex flex-col">
          <span className="text-muted-foreground text-xs">{title}</span>
          <span className="font-medium">{value}</span>
        </div>
      </div>
      {hideContent && (
        <div>
          {isHidden && (
            <Button variant={"ghost"} onClick={() => setIsHidden(false)}>
              <EyeOffIcon className="w-4 h-4" />
            </Button>
          )}
          {!isHidden && (
            <Button variant={"ghost"} onClick={() => setIsHidden(true)}>
              <EyeIcon className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
