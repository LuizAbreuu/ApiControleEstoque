import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Manager Web",
  description: "Sistema Administrativo de Gerenciamento de Estoque Enterprise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
