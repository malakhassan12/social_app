import { MessageReactionType, ReactionConfig } from "@/types/reaction.Types";

export const REACTIONS: ReactionConfig[] = [
  {
    type: MessageReactionType.LIKE,
    emoji: "👍",
    label: "Like",
    color:
      "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700",
  },
  {
    type: MessageReactionType.LOVE,
    emoji: "❤️",
    label: "Love",
    color: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700",
  },
  {
    type: MessageReactionType.LAUGH,
    emoji: "😂",
    label: "Laugh",
    color:
      "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700",
  },
  {
    type: MessageReactionType.WOW,
    emoji: "😮",
    label: "Wow",
    color:
      "bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700",
  },
  {
    type: MessageReactionType.SAD,
    emoji: "😢",
    label: "Sad",
    color:
      "bg-cyan-100 dark:bg-cyan-900/30 border-cyan-300 dark:border-cyan-700",
  },
  {
    type: MessageReactionType.ANGRY,
    emoji: "😡",
    label: "Angry",
    color: "bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700",
  },
  {
    type: MessageReactionType.CELEBRATE,
    emoji: "🎉",
    label: "Celebrate",
    color:
      "bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700",
  },
];