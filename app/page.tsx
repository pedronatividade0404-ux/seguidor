import HomeForm from "@/components/HomeForm";

export default function Home() {
  return (
    <main className="page center">
      <div className="shell">
        <div className="brand">NEXA<span>.</span></div>
        <div className="eyebrow">CAMPAIGN SYSTEM / 01</div>
        <h1>Participe de uma campanha.</h1>
        <p className="muted">Informe seu perfil, escolha a quantidade e siga as etapas para enviar sua comprovação.</p>
        <HomeForm />
        <p className="legal">Ao continuar, você concorda em seguir as regras da campanha.</p>
      </div>
    </main>
  );
}
