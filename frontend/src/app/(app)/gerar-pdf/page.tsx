"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/store/useStore";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileDown,
  Loader2,
  Star,
  Lock,
  BookOpen,
  CheckCircle2,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function GerarPdfPage() {
  const { user } = useStore();
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch subjects for dropdown
  const { data: subjects, isLoading: isLoadingSubjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: async () => {
      const res = await api.get("/subjects");
      return res.data;
    },
  });

  const isPremium = user?.plan === "PREMIUM";

  const handleGenerate = async () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    if (!selectedSubject) return;

    setIsGenerating(true);
    setShowSuccess(false);

    try {
      const response = await api.get(
        `/exam-pdf/generate?subjectId=${selectedSubject}&count=${questionCount}`,
        { responseType: "blob" }
      );

      // Create download link
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Get subject name for filename
      const subject = subjects?.find(
        (s: any) => s.id === selectedSubject
      );
      const subjectName = subject?.name?.replace(/\s+/g, "_") || "Exame";
      link.download = `ExamPT_${subjectName}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (err) {
      console.error("Error generating PDF:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Gerar Exame PDF</h1>
        <p className="text-muted-foreground mt-2">
          Cria um exame personalizado em PDF para imprimir e resolver no papel,
          simulando o ambiente real de exame.
        </p>
      </div>

      {/* Main Card */}
      <Card className="border-white/10 overflow-hidden relative">
        {/* Premium gradient accent at top */}
        <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" />
            Configurar Exame
          </CardTitle>
          <CardDescription>
            Escolhe a disciplina e o número de questões para o teu exame.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Subject Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Disciplina
            </label>
            <select
              className="w-full h-12 rounded-xl border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={isGenerating}
            >
              <option value="">Seleciona uma disciplina...</option>
              {subjects?.map((sub: any) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.questionCount} questões)
                </option>
              ))}
            </select>
          </div>

          {/* Question Count */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground">
                Número de Questões
              </label>
              <span className="text-2xl font-bold text-primary">
                {questionCount}
              </span>
            </div>
            <input
              type="range"
              min={5}
              max={20}
              step={1}
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              disabled={isGenerating}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-primary/30
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
                [&::-moz-range-thumb]:bg-primary [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
            </div>
          </div>

          {/* What's included */}
          <div className="bg-white/5 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-foreground">
              O teu exame inclui:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "Questões aleatórias da disciplina",
                "Opções de resposta A/B/C/D",
                "Página de soluções no final",
                "Formato A4 pronto a imprimir",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={(!selectedSubject && isPremium) || isGenerating}
            variant={isPremium ? "default" : "premium"}
            className="w-full h-14 text-lg font-bold rounded-xl relative overflow-hidden group"
          >
            {isGenerating ? (
              <span className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                A gerar PDF...
              </span>
            ) : isPremium ? (
              <span className="flex items-center gap-3">
                <FileDown className="h-5 w-5" />
                Gerar Exame PDF
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Lock className="h-5 w-5" />
                Gerar Exame PDF
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full font-medium">
                  PREMIUM
                </span>
              </span>
            )}
          </Button>

          {/* Success message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-500 font-medium">
                  O teu exame foi gerado com sucesso! Verifica os downloads.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Info cards below */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <Card className="border-white/10 bg-gradient-to-br from-purple-500/5 to-background">
          <CardContent className="p-5 flex items-start gap-3">
            <div className="h-10 w-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Treino Real</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Simula as condições reais do exame resolvendo no papel, sem
                distrações digitais.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-gradient-to-br from-indigo-500/5 to-background">
          <CardContent className="p-5 flex items-start gap-3">
            <div className="h-10 w-10 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">Sempre Diferente</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cada PDF contém questões aleatórias — podes gerar quantos
                exames quiseres!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Premium Upsell Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-background border border-white/10 rounded-2xl p-8 max-w-md w-full relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

              {/* Close button */}
              <button
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content */}
              <div className="text-center space-y-4">
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <Star className="h-8 w-8 text-white" />
                </div>

                <h2 className="text-2xl font-bold">
                  Funcionalidade Premium
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                  A geração de exames em PDF é uma funcionalidade exclusiva do
                  plano{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 font-semibold">
                    Premium
                  </span>
                  . Faz upgrade para descarregar exames ilimitados e estudar no
                  papel!
                </p>

                <div className="bg-white/5 rounded-xl p-4 text-left space-y-2">
                  {[
                    "Exames em PDF ilimitados",
                    "Exercícios sem limite diário",
                    "Explicações detalhadas",
                    "Ranking completo + histórico",
                  ].map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle2 className="h-4 w-4 text-purple-400 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <Link href="/premium" className="w-full">
                    <Button
                      variant="premium"
                      className="w-full h-12 text-lg font-bold"
                    >
                      Ver Planos Premium
                    </Button>
                  </Link>
                  <button
                    onClick={() => setShowPremiumModal(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Talvez mais tarde
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
