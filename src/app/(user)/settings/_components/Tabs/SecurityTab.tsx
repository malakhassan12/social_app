import getSessions from "@/actions/session-device/getDeviceSessions";
import ChangePassword from "../Form/ChangePassword";
import SessionsSection from "../SessionsSection";

export default async function SecurityTab({
  accountId,
}: {
  accountId: string;
}) {
  const sessions = await getSessions();
  return (
    <div className="space-y-8">
      {/* ============================================ */}
      {/* SESSIONS                                     */}
      {/* ============================================ */}
      <SessionsSection initialSessions={sessions} />

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-slate-800" />

      {/* ============================================ */}
      {/* CHANGE PASSWORD                              */}
      {/* ============================================ */}

      <ChangePassword accountId={accountId} />
    </div>
  );
}
