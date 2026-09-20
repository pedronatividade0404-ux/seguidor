import { put, list } from "@vercel/blob";
import type { Campaign } from "./types";

const BLOB_PATH = "data/campaigns.json";

async function readRemote(): Promise<Campaign[]> {
  const { blobs } = await list({ prefix: BLOB_PATH, limit: 1 });
  const blob = blobs[0];
  if (!blob) return [];
  const res = await fetch(blob.url, { cache: "no-store" });
  if (!res.ok) throw new Error("Não foi possível ler o arquivo JSON.");
  return (await res.json()) as Campaign[];
}

export async function readCampaigns(): Promise<Campaign[]> {
  if (process.env.BLOB_READ_WRITE_TOKEN) return readRemote();

  // Fallback local: funciona para desenvolvimento/self-hosting.
  const fs = await import("node:fs/promises");
  const path = (await import("node:path")).join(process.cwd(), "data/campaigns.json");
  try {
    return JSON.parse(await fs.readFile(path, "utf8")) as Campaign[];
  } catch {
    return [];
  }
}

export async function writeCampaigns(campaigns: Campaign[]) {
  const body = JSON.stringify(campaigns, null, 2);

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    await put(BLOB_PATH, body, {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true
    });
    return;
  }

  const fs = await import("node:fs/promises");
  const path = (await import("node:path")).join(process.cwd(), "data/campaigns.json");
  await fs.writeFile(path, body, "utf8");
}

export async function getCampaign(id: string) {
  const campaigns = await readCampaigns();
  return campaigns.find((c) => c.id === id);
}

export async function updateCampaign(id: string, patch: Partial<Campaign>) {
  const campaigns = await readCampaigns();
  const index = campaigns.findIndex((c) => c.id === id);
  if (index === -1) return null;
  campaigns[index] = { ...campaigns[index], ...patch };
  await writeCampaigns(campaigns);
  return campaigns[index];
}

export async function addCampaign(campaign: Campaign) {
  const campaigns = await readCampaigns();
  campaigns.push(campaign);
  await writeCampaigns(campaigns);
  return campaign;
}
