use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeForm() {
  const [url, setUrl] = useState("");
  const [quantity, setQuantity] = useState(20);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tiktokUrl: url, quantity })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar campanha.");
      router.push(`/campanha?id=${data.id}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Erro inesperado.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card form-card">
      <label>Link do perfil TikTok</label>
      <input
        required
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.tiktok.com/@usuario"
      />

      <label>Quantidade da campanha</label>
      <div className="quantity-grid">
        {[20, 50, 100, 500].map((n) => (
          <button
            type="button"
            key={n}
            className={quantity === n ? "quantity active" : "quantity"}
            onClick={() => setQuantity(n)}
          >
            {n}
          </button>
        ))}
      </div>

      <button className="primary" disabled={loading}>
        {loading ? "Criando..." : "Prosseguir →"}
      </button>
    </form>
  );
}
