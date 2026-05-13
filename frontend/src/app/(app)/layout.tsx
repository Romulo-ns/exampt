"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { 
  LayoutDashboard, 
  BookOpen, 
  Trophy, 
  User, 
  LogOut, 
  Menu,
  X,
  Star,
  FileDown,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useStore();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("No token");
        
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, [user, setUser, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Exercícios", href: "/exercicios", icon: BookOpen },
    { name: "Gerar PDF", href: "/gerar-pdf", icon: FileDown },
    { name: "Ranking", href: "/ranking", icon: Trophy },
    { name: "Perfil", href: "/perfil", icon: User },
    { name: "Premium", href: "/premium", icon: Star },
  ];

  console.log("Current user object:", user);

  if (user?.role === 'ADMIN') {
    navItems.push({ name: "Admin Panel", href: "/admin/questions", icon: ShieldAlert });
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            ExamPT
          </span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-foreground">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar (Desktop) & Mobile Menu */}
      <aside className={`
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 
        fixed md:sticky top-[73px] md:top-0 left-0 z-40 w-full md:w-64 h-[calc(100vh-73px)] md:h-screen 
        border-r border-white/10 bg-background/95 md:bg-background/50 backdrop-blur-xl 
        transition-transform duration-300 ease-in-out
        flex flex-col
      `}>
        <div className="hidden md:flex p-6 items-center gap-2 mb-6">
          <Trophy className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            ExamPT
          </span>
        </div>

        <div className="flex-1 px-4 py-6 md:py-0 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                  ${isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }
                `}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user.nick.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user.nick}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                Lvl {user.level} • <span className={user.plan === 'PREMIUM' ? 'text-yellow-400' : 'text-primary'}>{user.plan}</span>
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Terminar Sessão
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
