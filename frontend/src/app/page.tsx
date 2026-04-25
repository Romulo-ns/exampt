import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trophy, TrendingUp, BookOpen, Brain, Target } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/60 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">ExamPT</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </Link>
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
            <Link href="/register">
              <Button variant="premium" size="sm">Começar Grátis</Button>
            </Link>
          </nav>
          {/* Mobile Nav Toggle could go here */}
          <div className="md:hidden flex items-center">
            <Link href="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="container relative mx-auto px-4 md:px-8 flex flex-col items-center text-center">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Prepara-te para os Exames Nacionais 2024
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
              Estudar não tem de ser <span className="bg-gradient-to-r from-indigo-400 to-primary bg-clip-text text-transparent">aborrecido.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
              A plataforma gamificada que te ajuda a subir a nota nos exames. Exercícios adaptativos, rankings nacionais e estatísticas detalhadas.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button variant="premium" size="lg" className="w-full sm:w-auto text-base">
                  Começar a Estudar Agora
                </Button>
              </Link>
              <Link href="#demo">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
                  Ver como funciona
                </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-10 w-full max-w-4xl">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">10+</span>
                <span className="text-sm text-muted-foreground">Disciplinas</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">5k+</span>
                <span className="text-sm text-muted-foreground">Questões Reais</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">2006</span>
                <span className="text-sm text-muted-foreground">Exames desde</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">100%</span>
                <span className="text-sm text-muted-foreground">Foco no Sucesso</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-black/40">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo o que precisas para <span className="text-primary">arrasar</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Desenvolvemos o ExamPT com as melhores técnicas de estudo e gamificação para garantir que te manténs motivado.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-start hover:bg-white/10 transition-colors">
                <div className="p-3 bg-primary/20 rounded-lg mb-4 text-primary">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Dificuldade Adaptativa</h3>
                <p className="text-muted-foreground text-sm">O nosso algoritmo aprende com os teus erros e acertos para te dar questões na zona ideal de aprendizagem.</p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-start hover:bg-white/10 transition-colors">
                <div className="p-3 bg-primary/20 rounded-lg mb-4 text-primary">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ranking Nacional</h3>
                <p className="text-muted-foreground text-sm">Ganha XP, sobe de nível e compete com estudantes de todo o país num ranking semanal e mensal.</p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col items-start hover:bg-white/10 transition-colors">
                <div className="p-3 bg-primary/20 rounded-lg mb-4 text-primary">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Estatísticas Detalhadas</h3>
                <p className="text-muted-foreground text-sm">Identifica os teus pontos fracos com gráficos detalhados de desempenho por disciplina e matéria.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Escolhe o teu plano</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Começa a treinar gratuitamente e faz upgrade quando quiseres ir mais longe.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <div className="border border-white/10 bg-white/5 p-8 rounded-3xl">
                <h3 className="text-2xl font-bold mb-2">Gratuito</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">€0</span>
                  <span className="text-muted-foreground"> /mês</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>10 exercícios adaptativos por dia</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Acesso a parte dos exames passados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Ranking básico (top 100)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Estatísticas simples</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button variant="outline" className="w-full">Começar Grátis</Button>
                </Link>
              </div>
              
              {/* Premium Plan */}
              <div className="border border-primary bg-primary/5 p-8 rounded-3xl relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Mais Popular
                </div>
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="mb-6">
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-extrabold">€4,99</span>
                    <span className="text-muted-foreground pb-1"> /mês</span>
                  </div>
                  <div className="text-sm font-medium text-primary">
                    ou €49,90 /ano <span className="text-white/70">(Poupa 2 meses)</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium text-white">Exercícios ilimitados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium text-white">Todos os exames (2006-2024)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium text-white">Ranking completo + histórico</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium text-white">Explicações passo a passo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="font-medium text-white">Dicas sem penalização de XP</span>
                  </li>
                </ul>
                <Link href="/register">
                  <Button variant="premium" className="w-full">Subscrever Premium</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/60 py-12">
        <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">ExamPT</span>
            </div>
            <p className="text-muted-foreground max-w-sm">
              A plataforma gamificada de preparação para os exames nacionais portugueses. Estuda de forma inteligente.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">Preços</Link></li>
              <li><Link href="/ranking" className="hover:text-white transition-colors">Ranking Público</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/termos" className="hover:text-white transition-colors">Termos de Serviço</Link></li>
              <li><Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link></li>
              <li><Link href="/contactos" className="hover:text-white transition-colors">Contactos</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-white/10 text-sm text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} ExamPT. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
