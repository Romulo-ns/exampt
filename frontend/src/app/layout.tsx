import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExamPT - Prepara-te para os Exames Nacionais",
  description: "Plataforma gamificada de preparação para exames nacionais portugueses. Exercícios adaptativos, ranking nacional e histórico de acertos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Default to dark mode class to match our globals.css
    <html lang="pt" className="dark" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary selection:text-primary-foreground`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
