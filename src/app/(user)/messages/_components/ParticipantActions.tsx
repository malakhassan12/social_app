import { Crown, Lock, Shield } from "lucide-react";
import { FC } from "react";
import { ConversationParticipantChat } from "./ChatControllerBtn";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import RemoveParticipantBtn from "./RemoveParticipantBtn";
import ToggleParticipantAdminBtn from "./ToggleParticipantAdminBtn";

const ParticipantActions: FC<{
  participant: ConversationParticipantChat;
  accountId: string;
  isAdmin: boolean;
  participantId: string;
  conversationId: string;
}> = ({ participant, accountId, isAdmin, participantId, conversationId }) => {
  const isCurrentAccount = participant.accountId === accountId;

  const memberName =
    participant.account?.name ||
    participant.account?.username ||
    participant.accountId;

  const memberUsername = participant.account?.username;

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={`
                            group flex items-center justify-between gap-3
                            rounded-xl
                            px-3 py-2.5
                            transition-all duration-150
                            ${
                              isCurrentAccount
                                ? "bg-primary/5 ring-1 ring-primary/10"
                                : "hover:bg-muted/60"
                            }
                          `}
        >
          {/* Avatar */}

          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div
              className={`
                                flex size-8 shrink-0
                                items-center justify-center
                                rounded-full
                                text-[10px]
                                font-bold
                                ${
                                  participant.isAdmin
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
                                    : "bg-muted text-muted-foreground"
                                }
                              `}
            >
              {participant.isAdmin ? (
                <Crown className="size-3.5" />
              ) : (
                <span>{memberName.charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-medium">
                  {isCurrentAccount ? "You" : memberName}
                </p>

                {participant.isAdmin && (
                  <span className="shrink-0 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                    Admin
                  </span>
                )}
              </div>

              {memberUsername && (
                <p className="truncate text-[10px] text-muted-foreground">
                  @{memberUsername}
                </p>
              )}
            </div>
          </div>

          {/* Role */}

          <div className="shrink-0">
            {participant.isAdmin ? (
              <div className="flex size-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800/50">
                <Shield className="size-3.5" />
              </div>
            ) : (
              <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Lock className="size-3.5" />
              </div>
            )}
          </div>
        </div>
      </ContextMenuTrigger>

      {!isCurrentAccount && isAdmin && (
        <ContextMenuContent>
          <ContextMenuItem>
            <RemoveParticipantBtn
              title={`Remove ${memberName}`}
              participantId={participantId}
              conversationId={conversationId}
              participantName={memberName}
              accountId={accountId}
            />
          </ContextMenuItem>
          <ContextMenuItem>
            <ToggleParticipantAdminBtn
              key={`${participant.id}-${participant.isAdmin}`}
              title={
                participant.isAdmin
                  ? `Remove ${memberName} as admin`
                  : `Make ${memberName} admin`
              }
              participantId={participantId}
              conversationId={conversationId}
              participantName={memberName}
              accountId={accountId}
              isAdmin={participant.isAdmin}
            />
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

export default ParticipantActions;
