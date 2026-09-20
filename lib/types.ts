export type CampaignStatus =
  | "waiting"
  | "accessed"
  | "waiting_proof"
  | "pending_review"
  | "approved"
  | "rejected"
  | "deleted";

export type Campaign = {
  id: string;
  tiktokUrl: string;
  quantity: number;
  status: CampaignStatus;
  createdAt: string;
  accessedAt?: string;
  proofSubmittedAt?: string;
  proofImageUrl?: string;
  discordMessageId?: string;
};
