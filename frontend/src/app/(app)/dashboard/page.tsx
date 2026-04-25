"use client";

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, Target, Trophy, Zap, BookOpen, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function DashboardPage() {
  const { user } = useStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats'],
    queryFn: async () => {
      const res = await api.get('/stats/me');
      return res.data;
    },
  });

  const { data: rank } = useQuery({
    queryKey: ['userRank'],
    queryFn: async () => {
      const res = await api.get('/ranking/me?period=week');
      return res.data;
    },
  });

  if (!user || isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Ensure weekly activity dates are formatted nicely for the chart
  const chartData = stats?.weeklyActivity ? [...stats.weeklyActivity].reverse().map((day: any) => ({
    name: day.day,
    Questões: day.count
  })) : [];

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Olá, {user.nick}! 👋</h1>
          <p className="text-muted-foreground mt-1">
            Estás no nível {user.level} com {user.xp} XP acumulado.
          </p>
        </div>
        <Link href="/exercicios">
          <Button variant="premium" size="lg" className="shadow-lg shadow-primary/20">
            Continuar a Estudar
            <BookOpen className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak Card */}
        <Card className="bg-gradient-to-br from-orange-500/10 to-background border-orange-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-500/80 mb-1">Ofensiva Atual</p>
              <h3 className="text-3xl font-bold text-orange-500">{user.streak} <span className="text-lg font-medium text-orange-500/60">dias</span></h3>
            </div>
            <div className="h-12 w-12 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Flame className="h-6 w-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        {/* XP Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary/80 mb-1">XP Total</p>
              <h3 className="text-3xl font-bold text-primary">{user.xp}</h3>
            </div>
            <div className="h-12 w-12 bg-primary/20 rounded-full flex items-center justify-center">
              <Zap className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Rank Card */}
        <Card className="bg-gradient-to-br from-yellow-500/10 to-background border-yellow-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-500/80 mb-1">Ranking Semanal</p>
              <h3 className="text-3xl font-bold text-yellow-500">
                {rank?.rank ? `#${rank.rank}` : '-'}
              </h3>
            </div>
            <div className="h-12 w-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Card */}
        <Card className="bg-gradient-to-br from-green-500/10 to-background border-green-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-500/80 mb-1">Taxa de Acerto</p>
              <h3 className="text-3xl font-bold text-green-500">{stats?.successRate || 0}%</h3>
            </div>
            <div className="h-12 w-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <Target className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activity Chart */}
        <Card className="col-span-1 lg:col-span-2 border-white/10">
          <CardHeader>
            <CardTitle>Actividade Semanal</CardTitle>
            <CardDescription>Questões respondidas nos últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#1f1f2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} 
                  />
                  <Bar dataKey="Questões" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Breakdown */}
        <Card className="border-white/10">
          <CardHeader>
            <CardTitle>Desempenho por Matéria</CardTitle>
            <CardDescription>A tua taxa de acerto</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.subjectStats?.length > 0 ? (
              <div className="space-y-6">
                {stats.subjectStats.map((sub: any) => (
                  <div key={sub.subjectId} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium truncate pr-2">{sub.subjectName}</span>
                      <span className="text-muted-foreground">{sub.successRate}%</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${sub.successRate}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      {sub.correctAttempts} / {sub.totalAttempts} acertos
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10 text-center space-y-3">
                <div className="p-3 bg-white/5 rounded-full">
                  <BookOpen className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Ainda não tens dados suficientes. Começa a resolver exercícios!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
