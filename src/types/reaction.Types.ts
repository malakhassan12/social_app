export enum MessageReactionType {
  LIKE = "LIKE",
  LOVE = "LOVE",
  LAUGH = "LAUGH",
  WOW = "WOW",
  SAD = "SAD",
  ANGRY = "ANGRY",
  CELEBRATE = "CELEBRATE",
}


export interface ReactionConfig {
  type: MessageReactionType;
  emoji: string;
  label: string;
  color: string; // for active state
}
