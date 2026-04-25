"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Lightbulb, Zap, ArrowRight, Lock, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ExerciciosPage() {
  const { user, setUser } = useStore();
  const queryClient = useQueryClient();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<any>(null);

  // Fetch subjects for filter
  const { data: subjects } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const res = await api.get('/subjects');
      return res.data;
    }
  });

  // Fetch today's attempt count for free users
  const { data: limitInfo } = useQuery({
    queryKey: ['todayCount'],
    queryFn: async () => {
      const res = await api.get('/attempts/today-count');
      return res.data;
    }
  });

  // Fetch next question
  const { data: question, isLoading: isLoadingQuestion, refetch: fetchNextQuestion } = useQuery({
    queryKey: ['nextQuestion', selectedSubject],
    queryFn: async () => {
      const res = await api.get(`/questions/next${selectedSubject ? `?subjectId=${selectedSubject}` : ''}`);
      setHintUsed(false);
      setShowHint(false);
      setSelectedOption(null);
      setResult(null);
      return res.data;
    },
    enabled: !!limitInfo && (limitInfo.limit === null || limitInfo.count < limitInfo.limit)
  });

  // Track start time when a new question loads
  useEffect(() => {
    if (question) {
      setStartTime(Date.now());
    }
  }, [question?.id]);

  // Submit attempt mutation
  const submitAttempt = useMutation({
    mutationFn: async (optionId: string) => {
      const timeSpentMs = Date.now() - startTime;
      const res = await api.post('/attempts', {
        questionId: question.id,
        optionId,
        hintUsed,
        timeSpentMs
      });
      return res.data;
    },
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ['todayCount'] });
      queryClient.invalidateQueries({ queryKey: ['userStats'] });
      queryClient.invalidateQueries({ queryKey: ['userRank'] });
      
      // Update local user state for XP/Streak
      if (data.xpEarned > 0 && user) {
        setUser({ ...user, xp: user.xp + data.xpEarned });
      }
    }
  });

  const handleOptionClick = (optionId: string) => {
    if (result) return; // Prevent changing answer after submit
    setSelectedOption(optionId);
  };

  const handleSubmit = () => {
    if (!selectedOption || result) return;
    submitAttempt.mutate(selectedOption);
  };

  const handleNext = () => {
    fetchNextQuestion();
  };

  const toggleHint = () => {
    if (!hintUsed) setHintUsed(true);
    setShowHint(!showHint);
  };

  // Limit reached state
  if (limitInfo && limitInfo.limit !== null && limitInfo.count >= limitInfo.limit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <div className="h-20 w-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
          <Lock className="h-10 w-10 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4">Limite Diário Atingido</h2>
        <p className="text-muted-foreground mb-8">
          Completaste os teus 10 exercícios gratuitos de hoje. Volta amanhã ou faz upgrade para Premium para estudares sem limites!
        </p>
        <Link href="/premium" className="w-full">
          <Button variant="premium" className="w-full h-12 text-lg">Desbloquear Premium</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Exercícios</h1>
          {limitInfo?.limit && (
            <p className="text-sm text-muted-foreground mt-1">
              Questão {limitInfo.count + 1} de {limitInfo.limit} diárias
            </p>
          )}
        </div>
        
        <div className="w-full md:w-auto">
          <select 
            className="w-full md:w-64 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!!result} // Don't allow changing subject mid-question review
          >
            <option value="">Todas as Disciplinas</option>
            {subjects?.map((sub: any) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoadingQuestion ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !question ? (
        <Card className="text-center p-12 border-white/10">
          <h3 className="text-xl font-semibold mb-2">Sem questões disponíveis</h3>
          <p className="text-muted-foreground">Não encontrámos mais questões para esta disciplina neste momento.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-white/10 overflow-hidden relative">
            {/* Progress/Difficulty bar */}
            <div className="h-1 w-full bg-white/10 absolute top-0 left-0">
              <div 
                className={`h-full ${
                  question.difficultyComputed > 4 ? 'bg-destructive' : 
                  question.difficultyComputed > 2 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${(question.difficultyComputed / 5) * 100}%` }}
              />
            </div>

            <CardHeader className="pt-8 pb-4">
              <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
                <span className="font-medium bg-white/5 px-3 py-1 rounded-full">{question.subject.name}</span>
                <span>{question.year ? `${question.year} • ${question.examPhase}` : 'Treino'}</span>
              </div>
              <CardTitle className="text-xl leading-relaxed whitespace-pre-wrap">{question.text}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {question.options.map((opt: any) => {
                const isSelected = selectedOption === opt.id;
                let optClass = "border-white/10 hover:border-primary/50 hover:bg-white/5";
                
                if (result) {
                  if (opt.id === result.correctOptionId) {
                    optClass = "border-green-500 bg-green-500/10 text-green-400";
                  } else if (isSelected && !result.isCorrect) {
                    optClass = "border-destructive bg-destructive/10 text-destructive";
                  } else {
                    optClass = "border-white/5 opacity-50";
                  }
                } else if (isSelected) {
                  optClass = "border-primary bg-primary/10 text-primary";
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionClick(opt.id)}
                    disabled={!!result}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${optClass}`}
                  >
                    <span className={`font-bold flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-sm ${isSelected && !result ? 'bg-primary text-white' : 'bg-white/10'}`}>
                      {opt.label}
                    </span>
                    <span className="mt-0.5">{opt.text}</span>
                    
                    {result && opt.id === result.correctOptionId && (
                      <CheckCircle2 className="h-5 w-5 text-green-500 ml-auto flex-shrink-0" />
                    )}
                    {result && isSelected && !result.isCorrect && (
                      <XCircle className="h-5 w-5 text-destructive ml-auto flex-shrink-0" />
                    )}
                  </button>
                );
              })}

              {question.hint && !result && (
                <div className="pt-4 flex justify-end">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={toggleHint}
                    className={hintUsed ? "text-yellow-500" : "text-muted-foreground"}
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    {showHint ? "Ocultar Dica" : "Ver Dica"}
                  </Button>
                </div>
              )}

              <AnimatePresence>
                {showHint && question.hint && !result && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-500/90 p-4 rounded-lg text-sm mt-4 flex items-start gap-3"
                  >
                    <Lightbulb className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold mb-1">Dica:</p>
                      <p>{question.hint}</p>
                      {user?.plan === 'FREE' && (
                        <p className="text-xs opacity-70 mt-2">Nota: Usar dicas anula o XP ganho nesta questão para contas gratuitas.</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>

            <CardFooter className="pt-4 pb-6">
              {!result ? (
                <Button 
                  className="w-full h-12 text-lg font-bold" 
                  onClick={handleSubmit}
                  disabled={!selectedOption || submitAttempt.isPending}
                >
                  {submitAttempt.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirmar Resposta"}
                </Button>
              ) : null}
            </CardFooter>
          </Card>

          {/* Results Area */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border ${
                  result.isCorrect 
                    ? "bg-green-500/10 border-green-500/20" 
                    : "bg-destructive/10 border-destructive/20"
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {result.isCorrect ? (
                      <div className="bg-green-500/20 p-2 rounded-full">
                        <CheckCircle2 className="h-8 w-8 text-green-500" />
                      </div>
                    ) : (
                      <div className="bg-destructive/20 p-2 rounded-full">
                        <XCircle className="h-8 w-8 text-destructive" />
                      </div>
                    )}
                    <div>
                      <h3 className={`text-2xl font-bold ${result.isCorrect ? "text-green-500" : "text-destructive"}`}>
                        {result.isCorrect ? "Correto!" : "Incorreto"}
                      </h3>
                      {result.xpEarned > 0 && (
                        <p className="text-sm font-medium flex items-center text-primary mt-1">
                          <Zap className="h-4 w-4 mr-1" /> +{result.xpEarned} XP
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <Button onClick={handleNext} variant={result.isCorrect ? "default" : "secondary"}>
                    Próxima Questão
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {result.explanation && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Explicação
                    </h4>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {result.explanation}
                    </p>
                  </div>
                )}

                {!result.explanation && user?.plan === 'FREE' && (
                  <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Faz upgrade para Premium para ver as explicações detalhadas.</p>
                    <Link href="/premium">
                      <Button variant="outline" size="sm">Ver Premium</Button>
                    </Link>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
