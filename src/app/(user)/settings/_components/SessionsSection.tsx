"use client";

import {
  LogOut,
  Monitor,
  Smartphone,
} from "lucide-react";

import {
  useState,
  useTransition,
} from "react";

import { toast } from "sonner";

import revokeSession from "@/actions/session-device/revokeDeviceSession";

import revokeAllSessions from "@/actions/session-device/revokeDeviceSessions";

type Session = {
  id: string;
  accountId: string;
  accountName: string;
  username: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: Date;
  lastActiveAt: Date;
  current: boolean;
};

const SessionsSection = ({
  initialSessions,
}: {
  initialSessions: Session[];
}) => {
  const [sessions, setSessions] =
    useState<Session[]>(
      initialSessions,
    );

  const [
    isRevoking,
    startRevokeTransition,
  ] = useTransition();

  const parseDevice = (
    userAgent: string | null,
  ) => {
    if (!userAgent) {
      return "desktop";
    }

    return /Android|iPhone|iPad|Mobile/i.test(
      userAgent,
    )
      ? "mobile"
      : "desktop";
  };

  /*
   * =====================================
   * Revoke One Session
   * =====================================
   */

  const handleRevoke = (
    sessionId: string,
  ) => {
    startRevokeTransition(
      async () => {
        const result =
          await revokeSession(
            sessionId,
          );

        if (!result.success) {
          toast.error(
            result.message ||
              "Failed to revoke session",
          );

          return;
        }

        setSessions(
          (current) =>
            current.filter(
              (session) =>
                session.id !==
                sessionId,
            ),
        );

        toast.success(
          result.message ||
            "Session revoked successfully",
        );
      },
    );
  };

  /*
   * =====================================
   * Revoke All OTHER Sessions
   * =====================================
   */

  const handleRevokeAll = () => {
    startRevokeTransition(
      async () => {
        const result =
          await revokeAllSessions();

        if (!result.success) {
          toast.error(
            result.message ||
              "Failed to revoke sessions",
          );

          return;
        }

        /*
         * Keep CURRENT session only
         */
        setSessions(
          (current) =>
            current.filter(
              (session) =>
                session.current === true,
            ),
        );

        toast.success(
          result.message ||
            "All other sessions have been revoked",
        );
      },
    );
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Active Sessions
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Devices currently signed in to your account.
          </p>
        </div>

        {sessions.length > 1 && (
          <button
            type="button"
            onClick={handleRevokeAll}
            disabled={isRevoking}
            className="
              shrink-0 inline-flex items-center gap-1.5
              px-3 py-1.5 text-xs font-medium rounded-lg
              text-red-600 dark:text-red-400
              bg-red-50 dark:bg-red-950/40
              border border-red-200 dark:border-red-900/50
              hover:bg-red-100 dark:hover:bg-red-950/60
              disabled:opacity-50
              disabled:cursor-not-allowed
              transition-colors
            "
          >
            <LogOut className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">
              Sign out all
            </span>

            <span className="sm:hidden">
              All
            </span>
          </button>
        )}
      </div>

      <div
        className="
          rounded-lg border border-slate-200
          dark:border-slate-800
          bg-white dark:bg-slate-950
          divide-y divide-slate-100
          dark:divide-slate-800
          overflow-hidden
        "
      >
        {sessions.map((session) => {
          const device =
            parseDevice(
              session.userAgent,
            );

          return (
            <div
              key={session.id}
              className="
                flex items-center
                justify-between gap-3 sm:gap-4
                p-3.5 sm:p-4
              "
            >
              <div
                className="
                  h-9 w-9 sm:h-10 sm:w-10
                  rounded-lg shrink-0
                  flex items-center justify-center
                  bg-slate-100 dark:bg-slate-900
                  text-slate-500
                  dark:text-slate-400
                "
              >
                {device === "mobile" ? (
                  <Smartphone className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Monitor className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                    {session.accountName}
                  </p>

                  {session.current && (
                    <span
                      className="
                        inline-flex items-center gap-1
                        px-1.5 py-0.5
                        text-[10px] font-semibold rounded
                        bg-green-100
                        dark:bg-green-950/40
                        text-green-700
                        dark:text-green-400
                      "
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                      Current
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  @{session.username}
                  {" · "}
                  {session.ipAddress ??
                    "Unknown IP"}
                </p>
              </div>

              {!session.current && (
                <button
                  type="button"
                  onClick={() =>
                    handleRevoke(
                      session.id,
                    )
                  }
                  disabled={isRevoking}
                  className="
                    shrink-0 px-2.5 py-1.5
                    text-xs font-medium rounded-lg
                    text-slate-600
                    dark:text-slate-400
                    hover:text-red-600
                    dark:hover:text-red-400
                    hover:bg-red-50
                    dark:hover:bg-red-950/40
                    disabled:opacity-50
                    disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  Revoke
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SessionsSection;