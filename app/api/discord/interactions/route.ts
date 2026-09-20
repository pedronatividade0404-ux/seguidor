import { NextResponse } from "next/server";
import { verifyKey } from "discord-interactions";
import { getCampaign, updateCampaign } from "@/lib/store";
import { deleteDiscordMessage, updateDiscordMessage } from "@/lib/discord";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-signature-ed25519");
  const timestamp = req.headers.get("x-signature-timestamp");
  const publicKey = process.env.DISCORD_PUBLIC_KEY;

  if (!signature || !timestamp || !publicKey) return new NextResponse("Unauthorized", { status: 401 });

  const valid = verifyKey(raw, signature, timestamp, publicKey);
  if (!valid) return new NextResponse("Bad signature", { status: 401 });

  const body = JSON.parse(raw);

  if (body.type === 1) {
    return NextResponse.json({ type: 1 });
  }

  if (body.type !== 3) return NextResponse.json({ type: 4, data: { content: "Interação não suportada." } });

  const customId = String(body.data?.custom_id || "");
  const [action, id] = customId.split(":");
  const campaign = await getCampaign(id);

  if (!campaign) {
    return NextResponse.json({ type: 4, data: { content: "Campanha não encontrada.", flags: 64 } });
  }

  if (action === "approve") {
    await updateCampaign(id, { status: "approved" });
    if (campaign.discordMessageId) {
      await updateDiscordMessage(campaign.discordMessageId, `✅ Campanha **#${id}** aprovada manualmente.`);
    }
    return NextResponse.json({ type: 4, data: { content: `Campanha #${id} aprovada.`, flags: 64 } });
  }

  if (action === "delete") {
    await updateCampaign(id, { status: "deleted" });
    if (campaign.discordMessageId) await deleteDiscordMessage(campaign.discordMessageId);
    return NextResponse.json({ type: 4, data: { content: `Campanha #${id} removida.`, flags: 64 } });
  }

  return NextResponse.json({ type: 4, data: { content: "Ação desconhecida.", flags: 64 } });
}
