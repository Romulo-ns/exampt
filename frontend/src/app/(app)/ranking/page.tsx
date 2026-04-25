"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Medal, Crown, Loader2, Zap } from "lucide-react";

type Period = "WEEK" | "MONTH" | "ALL";

export default function RankingPage() {
  const { user } = useStore();
  const [period, setPeriod] = useState<Period>("WEEK");

  const { data: ranking, isLoading } = useQuery({
    queryKey: ['ranking', period],
    queryFn: async () => {
      const res = await api.get(`/ranking?period=${period}`);
      return res.data;
    }
  });

  const top3 = ranking?.slice(0, 3) || [];
  const restOfRanking = ranking?.slice(3) || [];

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-center md:text-left">Ranking Nacional</h1>
          <p className="text-muted-foreground mt-1 text-center md:text-left">
            Compete com estudantes de todo o país e sobe na tabela.
          </p>
        </div>
        
        {/* Period Toggle */}
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-lg">
          <button
            onClick={() => setPeriod("WEEK")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              period === "WEEK" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setPeriod("MONTH")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              period === "MONTH" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            Mês
          </button>
          <button
            onClick={() => setPeriod("ALL")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              period === "ALL" ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            Geral
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : ranking?.length === 0 ? (
        <Card className="text-center p-12 border-white/10">
          <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">Ainda não há dados</h3>
          <p className="text-muted-foreground">Sê o primeiro a fazer exercícios para apareceres no ranking!</p>
        </Card>
      ) : (
        <>
          {/* Podium (Top 3) */}
          <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6 mb-16 pt-8">
            {/* 2nd Place */}
            {top3[1] && (
              <div className="order-2 md:order-1 flex flex-col items-center w-full md:w-1/3">
                <div className="relative mb-4">
                  <div className="h-20 w-20 rounded-full bg-slate-300/20 border-4 border-slate-300 flex items-center justify-center text-2xl font-bold text-white shadow-[0_0_20px_rgba(203,213,225,0.3)]">
                    {top3[1].nick.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-slate-300 text-slate-900 rounded-full p-1 border-4 border-background">
                    <Medal className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-center bg-white/5 border border-white/10 w-full rounded-t-2xl p-6 pt-8 -mt-6">
                  <p className="font-bold text-lg truncate">{top3[1].nick}</p>
                  <p className="text-sm text-slate-300/80 mb-2">Lvl {top3[1].level}</p>
                  <p className="font-bold text-slate-300 flex items-center justify-center gap-1">
                    <Zap className="h-4 w-4" /> {top3[1].score} XP
                  </p>
                </div>
              </div>
            )}

            {/* 1st Place */}
            {top3[0] && (
              <div className="order-1 md:order-2 flex flex-col items-center w-full md:w-1/3 z-10">
                <div className="relative mb-6">
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400">
                    <Crown className="h-8 w-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                  </div>
                  <div className="h-24 w-24 rounded-full bg-yellow-400/20 border-4 border-yellow-400 flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_30px_rgba(250,204,21,0.4)]">
                    {top3[0].nick.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="text-center bg-gradient-to-b from-primary/20 to-background border border-primary/30 w-full rounded-t-2xl p-8 pt-10 -mt-8 shadow-xl">
                  <p className="font-bold text-xl truncate text-yellow-400">{top3[0].nick}</p>
                  <p className="text-sm text-yellow-400/80 mb-3">Lvl {top3[0].level}</p>
                  <p className="font-bold text-yellow-400 text-xl flex items-center justify-center gap-1">
                    <Zap className="h-5 w-5" /> {top3[0].score} XP
                  </p>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {top3[2] && (
              <div className="order-3 flex flex-col items-center w-full md:w-1/3">
                <div className="relative mb-2">
                  <div className="h-16 w-16 rounded-full bg-amber-600/20 border-4 border-amber-600 flex items-center justify-center text-xl font-bold text-white shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                    {top3[2].nick.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amber-600 text-white rounded-full p-1 border-4 border-background">
                    <Medal className="h-4 w-4" />
                  </div>
                </div>
                <div className="text-center bg-white/5 border border-white/10 w-full rounded-t-2xl p-4 pt-6 -mt-4">
                  <p className="font-bold truncate">{top3[2].nick}</p>
                  <p className="text-xs text-amber-600/80 mb-1">Lvl {top3[2].level}</p>
                  <p className="font-semibold text-amber-600 flex items-center justify-center gap-1 text-sm">
                    <Zap className="h-3 w-3" /> {top3[2].score} XP
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* List (4th - 100th) */}
          {restOfRanking.length > 0 && (
            <Card className="border-white/10 overflow-hidden">
              <div className="divide-y divide-white/5">
                {restOfRanking.map((r: any) => {
                  const isCurrentUser = r.userId === user?.id;
                  return (
                    <div 
                      key={r.userId} 
                      className={`flex items-center p-4 hover:bg-white/5 transition-colors ${
                        isCurrentUser ? "bg-primary/10 hover:bg-primary/20" : ""
                      }`}
                    >
                      <div className="w-12 text-center font-bold text-muted-foreground">
                        #{r.rank}
                      </div>
                      
                      <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm mx-4">
                        {r.nick.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`font-semibold ${isCurrentUser ? "text-primary" : ""}`}>
                          {r.nick} {isCurrentUser && "(Tu)"}
                        </p>
                        <p className="text-xs text-muted-foreground">Nível {r.level}</p>
                      </div>
                      
                      <div className="font-bold flex items-center gap-1">
                        {r.score} <span className="text-muted-foreground text-xs font-normal">XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
