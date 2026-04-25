"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Edit2, CheckCircle2, Shield, Zap, Target, BookOpen, Star, AlertCircle } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

const BADGE_DEFINITIONS = [
  { id: "survivor", name: "Sobrevivente", icon: Shield, description: "Acertou 5 questões seguidas", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "biologist", name: "Biólogo Amador", icon: Target, description: "Acertou 10 questões de Biologia", color: "text-green-500", bg: "bg-green-500/10" },
  { id: "fast", name: "Rápido no Gatilho", icon: Zap, description: "Respondeu em menos de 10 segundos", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { id: "scholar", name: "Estudioso", icon: BookOpen, description: "Concluiu 50 exercícios", color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "master", name: "Mestre", icon: Star, description: "Atingiu o nível 10", color: "text-orange-500", bg: "bg-orange-500/10" },
];

export default function PerfilPage() {
  const { user, setUser } = useStore();
  const queryClient = useQueryClient();
  const [isEditingNick, setIsEditingNick] = useState(false);
  const [newNick, setNewNick] = useState("");
  const [nickError, setNickError] = useState("");

  useEffect(() => {
    if (user?.nick) {
      setNewNick(user.nick);
    }
  }, [user]);

  // Fetch Stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const res = await api.get('/users/me/stats');
      return res.data;
    }
  });

  // Update Nick Mutation
  const updateNick = useMutation({
    mutationFn: async (nick: string) => {
      const res = await api.patch('/users/me/nick', { nick });
      return res.data;
    },
    onSuccess: (data) => {
      setIsEditingNick(false);
      setNickError("");
      if (user) {
        setUser({ ...user, nick: data.nick });
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      setNickError(error.response?.data?.message || "Erro ao alterar o nick");
    }
  });

  const handleNickSubmit = () => {
    if (newNick === user?.nick) {
      setIsEditingNick(false);
      return;
    }
    updateNick.mutate(newNick);
  };

  const getBadgeDefinition = (badgeId: string) => {
    return BADGE_DEFINITIONS.find(b => b.id === badgeId) || BADGE_DEFINITIONS[0];
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Determine earned badges (if user.badges exists, map it; otherwise show default locked state)
  const earnedBadgeIds = user.badges?.map((b: any) => b.badgeId) || [];

  return (
    <div className="max-w-4xl mx-auto pb-20 space-y-8">
      <h1 className="text-3xl font-bold">O Meu Perfil</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Info */}
        <Card className="md:col-span-1 border-white/10">
          <CardHeader>
            <CardTitle>Detalhes da Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white uppercase">
                {user.nick?.charAt(0) || user.email.charAt(0)}
              </div>
              
              <div className="text-center w-full">
                {isEditingNick ? (
                  <div className="space-y-2">
                    <Input 
                      value={newNick} 
                      onChange={(e) => setNewNick(e.target.value)} 
                      placeholder="Novo Nickname"
                    />
                    {nickError && <p className="text-xs text-destructive text-left">{nickError}</p>}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleNickSubmit} disabled={updateNick.isPending} className="flex-1">
                        {updateNick.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Guardar"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setIsEditingNick(false); setNickError(""); }} className="flex-1">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <h2 className="text-xl font-bold">{user.nick}</h2>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => setIsEditingNick(true)}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs font-semibold mt-3">
                  Plano {user.plan}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Membro desde</span>
                <span>{user.createdAt ? format(new Date(user.createdAt), "MMM yyyy", { locale: pt }) : "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nível</span>
                <span className="font-bold text-primary">{user.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">XP Total</span>
                <span>{user.xp} XP</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Radar */}
        <Card className="md:col-span-2 border-white/10">
          <CardHeader>
            <CardTitle>Desempenho por Disciplina</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingStats ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : stats?.radarData && stats.radarData.length > 0 ? (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Taxa de Acerto (%)"
                      dataKey="score"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.4}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <AlertCircle className="h-12 w-12 mb-4 opacity-20" />
                <p>Faz alguns exercícios para veres aqui o teu gráfico de desempenho.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Badges Section */}
      <Card className="border-white/10">
        <CardHeader>
          <CardTitle>As Minhas Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {BADGE_DEFINITIONS.map((badge) => {
              const isEarned = earnedBadgeIds.includes(badge.id);
              const Icon = badge.icon;
              
              return (
                <div 
                  key={badge.id}
                  className={`flex flex-col items-center text-center p-4 rounded-xl border ${
                    isEarned ? 'border-white/10 bg-white/5' : 'border-white/5 bg-transparent opacity-40 grayscale'
                  } transition-all`}
                >
                  <div className={`p-3 rounded-full mb-3 ${isEarned ? badge.bg : 'bg-white/10'}`}>
                    <Icon className={`h-6 w-6 ${isEarned ? badge.color : 'text-white/50'}`} />
                  </div>
                  <h4 className="font-bold text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-muted-foreground">{badge.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
