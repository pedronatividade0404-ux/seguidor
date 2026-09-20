import "./globals.css";

export const metadata = {
  title: "Nexa Campaigns",
  description: "Sistema de campanhas e comprovações"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
