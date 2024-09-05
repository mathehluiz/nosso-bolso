import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import AuthProvider from "@/providers/auth-provider";
import GuestControl from "@/providers/guest-control";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Nosso bolso",
  description: "Acompanhe suas finanças de forma simples e eficiente",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <Toaster closeButton position="top-right" />
      <body className={poppins.className}>
        <AuthProvider>
          <GuestControl>{children}</GuestControl>
        </AuthProvider>
      </body>
    </html>
  );
}
