use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProofClient() {
  const id = useSearchParams().get("id");
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  function choose(f: File | undefined) {
    if (!f) return;
    if (!f.type.startsWith("image/")) return alert("Envie apenas uma imagem.");
    if (f.size > 5 * 1024 * 1024) return alert("A imagem deve ter no máximo 5 MB.");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function send() {
    if (!id || !file) return;
    setLoading(true);
    const form = new FormData();
    form.append("id", id);
    form.append("image", file);
    const res = await fetch("/api/proof", { method: "POST", body: form });
    const data = await res.json();
    if (!res.ok) {
      alert(data.error || "Não foi possível enviar.");
      setLoading(false);
      return;
    }
    router.replace("/comprovacao/enviado");
  }

  return (
    <main className="page center">
      <div className="shell">
        <div className="eyebrow">CAMPAIGN / 03</div>
        <h1>Envie sua comprovação</h1>
        <p className="muted">Envie uma imagem que comprove a conclusão da atividade.</p>

        <label className="dropzone">
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => choose(e.target.files?.[0])} />
          {preview ? <img src={preview} alt="Prévia" /> : <><strong>Selecionar imagem</strong><span>PNG, JPG ou WEBP · até 5 MB</span></>}
        </label>

        <button className="primary" disabled={!file || loading} onClick={send}>
          {loading ? "Enviando..." : "Enviar comprovação"}
        </button>
      </div>
    </main>
  );
}
