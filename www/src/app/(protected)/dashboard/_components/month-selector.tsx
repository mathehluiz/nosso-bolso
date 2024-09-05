"use client";
import React from "react";
import { format } from "date-fns";
import { CircleArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";
import { MonthPicker } from "@/components/ui/month-picker";

type Props = {
  date: Date;
  setDate: (date: Date) => void;
};

export default function MonthSelector({ date, setDate }: Props) {
  return (
    <div className="w-32 flex pt-5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"ghost"}
            className={cn(
              "gap-2 flex text-left font-semibold",
              !date && "text-muted-foreground"
            )}
          >
            {date ? (
              format(date, "MMMM yyyy", {
                locale: ptBR,
              })
            ) : (
              <span>Selecione um mês</span>
            )}
            <CircleArrowDown className="mr-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <MonthPicker onMonthSelect={setDate} selectedMonth={date} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
