use client';

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Countdown from "./Countdown";

export default function CampaignClient() {
  const params = useSearchParams();
  const id = params.get("id");
  const router = useRouter();
  const [campaignUrl, setCampaignUrl] = useState("#");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    fetch("/api/campaign?id=" + encodeURIComponent(id || ""))
      .then((r) => r.json())
      .then((d) => {
        if (!d.campaign) throw new Error();
        setCampaignUrl(d.campaignUrl);
      })
      .catch(() => router.replace("/"));
  }, [id, router]);

  const finish = useCallback(() => {
    setDone(true);
    router.push(`/comprovacao?id=${encodeURIComponent(id || "")}`);
  }, [id, router]);

  async function access() {
    if (!id) return;
    setStarted(true);
    await fetch("/api/campaign", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    window.open(campaignUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="page center">
      <div className="shell">
        <div className="eyebrow">CAMPAIGN / 02</div>
        <h1>Complete a missão</h1>
        <p className="muted">Siga as instruções abaixo e envie uma comprovação ao final.</p>

        <div className="steps">
          {[
            ["01", "Crie ou use uma conta elegível para a campanha."],
            ["02", "Faça login na conta e conclua a atividade solicitada."],
            ["03", "Acesse o link usando o botão abaixo."],
            ["04", "Conclua a ação e aguarde o cronômetro."],
          ].map(([n, text]) => (
            <div className="step" key={n}>
              <span>{n}</span><p>{text}</p>
            </div>
          ))}
        </div>

        {!started ? (
          <button className="primary" onClick={access}>Acessar Link ↗</button>
        ) : (
          <div className="timer-wrap">
            <div className="muted">Aguarde o tempo da campanha</div>
            <Countdown seconds={180} onDone={finish} />
            {done && <button className="primary" onClick={finish}>Enviar comprovação →</button>}
          </div>
        )}
      </div>
    </main>
  );
}
