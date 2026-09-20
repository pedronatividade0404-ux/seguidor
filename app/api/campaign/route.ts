import { NextResponse } from "next/server";
import { addCampaign, getCampaign, updateCampaign } from "@/lib/store";
import { getCampaignUrl, QUANTITIES } from "@/lib/config";
import crypto from "node:crypto";

function validTikTok(url: string) {
  try {
    const u = new URL(url);
    return (u.hostname === "tiktok.com" || u.hostname.endsWith(".tiktok.com")) && u.pathname.startsWith("/@");
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const tiktokUrl = String(body?.tiktokUrl || "").trim();
  const quantity = Number(body?.quantity);

  if (!validTikTok(tiktokUrl)) {
    return NextResponse.json({ error: "Informe um link de perfil TikTok válido." }, { status: 400 });
  }
  if (!QUANTITIES.includes(quantity as (typeof QUANTITIES)[number])) {
    return NextResponse.json({ error: "Quantidade inválida." }, { status: 400 });
  }

  const campaign = {
    id: crypto.randomBytes(4).toString("hex").toUpperCase(),
    tiktokUrl,
    quantity,
    status: "waiting" as const,
    createdAt: new Date().toISOString()
  };
  await addCampaign(campaign);
  return NextResponse.json({ id: campaign.id });
}

export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID ausente." }, { status: 400 });
  const campaign = await getCampaign(id);
  if (!campaign) return NextResponse.json({ error: "Campanha não encontrada." }, { status: 404 });
  return NextResponse.json({ campaign, campaignUrl: getCampaignUrl() });
}

export async function PATCH(req: Request) {
  const { id } = await req.json().catch(() => ({}));
  if (!id) return NextResponse.json({ error: "ID ausente." }, { status: 400 });
  const campaign = await getCampaign(id);
  if (!campaign) return NextResponse.json({ error: "Campanha não encontrada." }, { status: 404 });
  const now = new Date().toISOString();
  await updateCampaign(id, { status: "waiting_proof", accessedAt: now });
  return NextResponse.json({ ok: true, accessedAt: now });
}
