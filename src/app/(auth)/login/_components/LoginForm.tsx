"use client";

import { useActionState, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { FormState } from "@/types/form.Types";
import { authLogin } from "@/actions/auth/authLogin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

const initialState: FormState = {
  errors: {},
};

const LoginForm = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState(authLogin, initialState);

  useEffect(() => {
    if (!state) return;

    const message = state.errors?.message;

    if (message) {
      toast.error(message, { position: "top-center" });
      return;
    }

    if (state.success) {
      toast.success("Sign in successfully", { position: "top-center" });
      router.replace("/");
    }
  }, [state, router]);

  return (
    <form className="space-y-5" action={formAction}>
      <div className="animate-element animate-delay-300">
        <label
          htmlFor="email"
          className="text-sm font-medium text-muted-foreground"
        >
          Email Address
        </label>
        <GlassInputWrapper>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
          />
        </GlassInputWrapper>
      </div>

      <div className="animate-element animate-delay-400">
        <label
          htmlFor="password"
          className="text-sm font-medium text-muted-foreground"
        >
          Password
        </label>
        <GlassInputWrapper>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
              )}
            </button>
          </div>
        </GlassInputWrapper>
      </div>

      <div className="animate-element animate-delay-500 flex items-center justify-between text-sm">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="rememberMe"
            className="custom-checkbox"
          />
          <span className="text-foreground/90">Keep me signed in</span>
        </label>
        <a
          href="/reset-password"
          className="hover:underline text-violet-400 transition-colors"
        >
          Reset password
        </a>
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        {pending && <Spinner data-icon="inline-start" />}
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
