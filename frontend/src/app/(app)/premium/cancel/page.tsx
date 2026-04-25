"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-24 w-24 bg-destructive/10 rounded-full flex items-center justify-center">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Pagamento Cancelado</h1>
        <p className="text-muted-foreground text-lg">
          O processo de pagamento foi cancelado ou ocorreu um erro. Não foi cobrado nenhum valor.
        </p>
        <div className="pt-8 flex flex-col gap-3">
          <Link href="/premium">
            <Button className="w-full text-lg h-12">
              Tentar Novamente
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" className="w-full h-12">
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
