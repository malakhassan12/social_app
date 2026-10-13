"use client";

import changePassword from "@/actions/settings/changePassword";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import Form from "next/form";
import { FC, useState, useTransition } from "react";
import { toast } from "sonner";

const ChangePassword: FC<{
  accountId: string;
}> = ({ accountId }) => {
  const [isPending, startTransition] = useTransition();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch = newPassword === confirmPassword;

  const isValid =
    newPassword.length >= 8 && passwordsMatch && confirmPassword.length > 0;

  const handlePasswordSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await changePassword(formData, accountId);

        if (result.success) {
          toast.success(result.message);

          // Clear the password fields
          setNewPassword("");
          setConfirmPassword("");

          return;
        }

        toast.error(result.message);
      } catch (error) {
        console.error("Change password error:", error);

        toast.error("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <section className="space-y-4">
      <Form action={handlePasswordSubmit} className="space-y-5">
        {/* Current Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />

          <Input
            name="currentPassword"
            type={showCurrent ? "text" : "password"}
            placeholder="Current password"
            required
            className="pr-10 pl-10"
          />

          <button
            type="button"
            onClick={() => setShowCurrent((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showCurrent ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {/* New Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />

          <Input
            name="newPassword"
            type={showNew ? "text" : "password"}
            placeholder="New password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pr-10 pl-10"
          />

          <button
            type="button"
            onClick={() => setShowNew((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showNew ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />

          <Input
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pr-10 pl-10"
          />

          <button
            type="button"
            onClick={() => setShowConfirm((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showConfirm ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending || !isValid}
          className="group relative w-full overflow-hidden rounded-xl bg-linear-to-r from-green-300 via-green-400 to-green-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:shadow-none
  "
        >
          {/* Animated shine overlay */}
          <span
            className="absolute inset-0 -translate-x-full bg-linear-to-r  from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full
  "
          />

          <span className="relative flex items-center justify-center gap-2">
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </span>
        </button>
      </Form>
    </section>
  );
};

export default ChangePassword;
