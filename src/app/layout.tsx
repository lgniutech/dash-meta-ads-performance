import type { Metadata } from "next";
import { Poppins, Outfit } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

// Using Outfit as a proxy for the 'Gate' font requested by the user
const gate = Outfit({
  variable: "--font-gate",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Meta Ads Performance | LGNIU TECH",
  description: "Dashboard premium de acompanhamento de resultados do Meta Ads",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased dark">
      <body
        className={`${poppins.variable} ${gate.variable} font-sans min-h-full flex flex-col bg-[#060e0e] text-[#ddf0f0]`}
      >
        {children}
      </body>
    </html>
  );
}
