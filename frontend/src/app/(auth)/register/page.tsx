"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Trophy, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth, registerSchema, type RegisterData } from "@/hooks/useAuth";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

export default function RegisterPage() {
  const { register: registerUser, isLoading, error, checkNickAvailability } = useAuth();
  const [nickStatus, setNickStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  });

  const nickValue = watch("nick");

  useEffect(() => {
    if (!nickValue || nickValue.length < 3) {
      setNickStatus('idle');
      return;
    }

    const timer = setTimeout(async () => {
      setNickStatus('checking');
      const status = await checkNickAvailability(nickValue);
      setNickStatus(status);
    }, 500);

    return () => clearTimeout(timer);
  }, [nickValue]);

  // Pre-warm the backend when the page loads
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    fetch(`${apiUrl}/health`).catch(() => {});
  }, []);

  const onSubmit = (data: RegisterData) => {
    if (nickStatus === 'taken') return;
    registerUser(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              ExamPT
            </span>
          </Link>
        </div>

        <Card className="border-white/10 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Join us and start rocking your exams
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  {...register("email")}
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="nick"
                    type="text"
                    placeholder="Nickname público"
                    {...register("nick")}
                    className={
                      errors.nick || nickStatus === 'taken' 
                        ? "border-destructive focus-visible:ring-destructive pr-10" 
                        : "pr-10"
                    }
                  />
                  <div className="absolute right-3 top-2.5 flex items-center">
                    {nickStatus === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    {nickStatus === 'available' && !errors.nick && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {nickStatus === 'taken' && <XCircle className="h-4 w-4 text-destructive" />}
                    {nickStatus === 'error' && <XCircle className="h-4 w-4 text-amber-500" />}
                  </div>
                </div>
                {errors.nick && (
                  <p className="text-xs text-destructive">{errors.nick.message}</p>
                )}
                {!errors.nick && nickStatus === 'taken' && (
                  <p className="text-xs text-destructive">This nickname is already in use</p>
                )}
                {!errors.nick && nickStatus === 'error' && (
                  <p className="text-xs text-amber-500">Error checking availability. Try again.</p>
                )}
                {!errors.nick && nickStatus === 'available' && (
                  <p className="text-xs text-green-500">Nickname available!</p>
                )}
              </div>

              <div className="space-y-2">
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password.message}</p>
                )}
              </div>
              
              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20 text-center">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 border-0" 
                disabled={isLoading || nickStatus === 'checking' || nickStatus === 'taken' || !isValid}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Register"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#09090b] px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <GoogleLoginButton />
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 text-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Sign in here
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
