import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCampaign, updateCampaign } from "@/lib/store";
import { sendDiscordReview } from "@/lib/discord";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const form = await req.formData();
  const id = String(form.get("id") || "");
  const file = form.get("image");

  if (!id || !(file instanceof File)) {
    return NextResponse.json({ error: "Dados incompletos." }, { status: 400 });
  }
  if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Imagem inválida ou maior que 5 MB." }, { status: 400 });
  }

  const campaign = await getCampaign(id);
  if (!campaign) return NextResponse.json({ error: "Campanha não encontrada." }, { status: 404 });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Configure BLOB_READ_WRITE_TOKEN na Vercel." }, { status: 500 });
  }

  const ext = file.name.split(".").pop()?.replace(/[^a-z0-9]/gi, "") || "jpg";
  const blob = await put(`proofs/${id}.${ext}`, file, {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true
  });

  const submittedAt = new Date().toISOString();
  const updated = await updateCampaign(id, {
    status: "pending_review",
    proofSubmittedAt: submittedAt,
    proofImageUrl: blob.url
  });

  try {
    const message = await sendDiscordReview({
      id,
      tiktokUrl: campaign.tiktokUrl,
      quantity: campaign.quantity,
      proofImageUrl: blob.url
    });
    await updateCampaign(id, { discordMessageId: message.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Comprovação salva, mas não foi possível enviar ao Discord." }, { status: 502 });
  }

  return NextResponse.json({ ok: true, campaign: updated });
}
