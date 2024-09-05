import {
  ChartNoAxesCombinedIcon,
  CogIcon,
  Home,
  WalletCards,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  subject?: string;
  action?: string;
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getPages(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Home",
          active: pathname.includes("/dashboard"),
          icon: Home,
          action: "view",
          subject: "dashboard",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/transactions/",
          label: "Transações",
          active: pathname.includes("/transactions"),
          icon: WalletCards,
          action: "view",
          subject: "transactions",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/reports/",
          label: "Relatórios",
          active: pathname.includes("/reports"),
          icon: ChartNoAxesCombinedIcon,
          action: "view",
          subject: "reports",
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "",
      menus: [
        {
          href: "/settings/",
          label: "Configurações",
          active: pathname.includes("/settings"),
          icon: CogIcon,
          action: "view",
          subject: "settings",
          submenus: [],
        },
      ],
    },
  ];
}
