"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser } = useStore();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (sessionId && user) {
      // In a real app, we might verify the session with the backend here.
      // But we rely on the webhook to actually update the DB.
      // We will just optimistically update the user state or re-fetch profile.
      
      api.get("/users/me")
        .then((res) => {
          setUser(res.data);
        })
        .finally(() => {
          setIsVerifying(false);
        });
    } else {
      setIsVerifying(false);
    }
  }, [searchParams, user, setUser]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      {isVerifying ? (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">A confirmar o teu pagamento...</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-md">
          <div className="flex justify-center">
            <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Pagamento Confirmado!</h1>
          <p className="text-muted-foreground text-lg">
            Obrigado por te juntares ao plano Premium. A tua conta já tem acesso a todas as funcionalidades exclusivas.
          </p>
          <div className="pt-8">
            <Link href="/dashboard">
              <Button className="w-full text-lg h-12">
                Ir para o Dashboard
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
