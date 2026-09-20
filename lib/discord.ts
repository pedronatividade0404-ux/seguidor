const webhook = () => process.env.DISCORD_WEBHOOK_URL;

export async function sendDiscordReview(campaign: {
  id: string;
  tiktokUrl: string;
  quantity: number;
  proofImageUrl: string;
}) {
  const url = webhook();
  if (!url) throw new Error("DISCORD_WEBHOOK_URL não configurado.");

  const payload = {
    content: "",
    embeds: [{
      title: "Nova comprovação",
      color: 0xffffff,
      fields: [
        { name: "Perfil TikTok", value: campaign.tiktokUrl, inline: false },
        { name: "Quantidade", value: String(campaign.quantity), inline: true },
        { name: "ID da campanha", value: `#${campaign.id}`, inline: true },
        { name: "Status", value: "AGUARDANDO ANÁLISE", inline: false }
      ],
      image: { url: campaign.proofImageUrl },
      footer: { text: "Nexa Campaigns" },
      timestamp: new Date().toISOString()
    }],
    components: [{
      type: 1,
      components: [
        { type: 2, style: 3, label: "Aprovar", custom_id: `approve:${campaign.id}` },
        { type: 2, style: 4, label: "Apagar", custom_id: `delete:${campaign.id}` }
      ]
    }]
  };

  const res = await fetch(`${url}?wait=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Discord retornou ${res.status}.`);
  return (await res.json()) as { id: string };
}

export async function deleteDiscordMessage(messageId: string) {
  const url = webhook();
  if (!url) throw new Error("DISCORD_WEBHOOK_URL não configurado.");
  const res = await fetch(`${url}/messages/${messageId}`, { method: "DELETE" });
  if (!res.ok && res.status !== 404) throw new Error(`Discord retornou ${res.status}.`);
}

export async function updateDiscordMessage(messageId: string, content: string) {
  const url = webhook();
  if (!url) throw new Error("DISCORD_WEBHOOK_URL não configurado.");
  const res = await fetch(`${url}/messages/${messageId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content,
      embeds: [],
      components: []
    })
  });
  if (!res.ok) throw new Error(`Discord retornou ${res.status}.`);
}
