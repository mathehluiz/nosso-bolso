import Link from "next/link";

import { cn } from "@/lib/utils";
import { Menu } from "@/components/sidebar/menu";
import { Button } from "@/components/ui/button";
import { useSidebarToggle } from "@/hooks/use-sidebar-toogle";
import { SidebarToggle } from "@/components/sidebar/sidebar-toggle";
import Image from "next/image";
import { useStore } from "@/hooks/use-store";

export function Sidebar() {
  const sidebar = useStore(useSidebarToggle, (state) => state);

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300",
        sidebar?.isOpen === false ? "w-[90px]" : "w-72"
      )}
    >
      <SidebarToggle isOpen={sidebar?.isOpen} setIsOpen={sidebar?.setIsOpen} />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-gray-800">
        <Button
          className={cn(
            "transition-transform ease-in-out duration-300 mb-1",
            sidebar?.isOpen === false ? "translate-x-1" : "translate-x-0"
          )}
          variant="link"
          asChild
        >
          <Link href="/home" className="flex items-center gap-2">
            <Image
              src="/logonossobolso.png"
              width={50}
              height={50}
              alt="Nosso-bolso"
            />
          </Link>
        </Button>
        <Menu isOpen={sidebar?.isOpen} />
      </div>
    </aside>
  );
}
