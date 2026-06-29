"use client";

import { useActionState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { FormState } from "@/types/form.Types";
import signupAction from "@/actions/auth/authSignUp";
import RightSectionSignup from "./RightSectionSignup";
import SocialBtns from "@/components/Buttons/SocialBtns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const initialState: FormState = {
  errors: {},
};

export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, isPending] = useActionState(
    signupAction,
    initialState,
  );

  const router = useRouter();

  useEffect(() => {
    if (!state) return;

    const message = state.errors?.message;

    if (message) {
      toast.error(message, { position: "top-center" });
      return;
    }

    if (state.success) {
      toast.success("Sign in successfully", { position: "top-center" });
      router.replace("/login");
    }
  }, [state, router]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-green-500 bg-transparent overflow-hidden p-0 border-2 shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* ===== LEFT SIDE: FORM ===== */}
          <form action={formAction} className="p-6 md:p-8 space-y-5">
            <FieldGroup>
              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-muted-foreground">
                  Join our community today
                </p>
              </div>

              {/* ===== Name ===== */}
              <Field className="animate-element animate-delay-300">
                <FieldLabel htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                />
              </Field>

              {/* ===== Email ===== */}
              <Field className="animate-element animate-delay-400">
                <FieldLabel htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />

                <FieldDescription>
                  We&lsquo;ll use this for account verification and updates.
                </FieldDescription>
              </Field>

              {/* ===== Country ===== */}
              <Field className="animate-element animate-delay-500">
                <FieldLabel htmlFor="country">
                  Country <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Egypt"
                  required
                />
              </Field>

              {/* ===== Phone ===== */}
              <Field className="animate-element animate-delay-600">
                <FieldLabel htmlFor="phone">
                  Phone Number <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+201001234567"
                />
              </Field>

              {/* ===== Password & Confirm ===== */}
              <Field className="animate-element animate-delay-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel htmlFor="password">
                      Password <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password <span className="text-red-500">*</span>
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                    />
                  </div>
                </div>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>

              {/* ===== Submit Button ===== */}
              <Field className="animate-element animate-delay-800">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Field>

              {/* ===== Divider ===== */}
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              {/* ===== Social Buttons ===== */}
              <SocialBtns />

              {/* ===== Login Link ===== */}
              <FieldDescription className="text-center">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          {/* ===== RIGHT SIDE: HERO IMAGE ===== */}
          <RightSectionSignup />
        </CardContent>
      </Card>

      {/* ===== Footer Terms ===== */}
      <p className="text-center text-xs text-muted-foreground px-6">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="hover:underline text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="hover:underline text-primary">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
