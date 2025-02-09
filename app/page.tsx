import IncomeImpact from "@/components/income-impact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verteil-O-Mat",
  description:
    "Verteil-O-Mat - Wie wirkt sich die Bundestagswahl am 23.02.2025 auf Ihr Einkommen aus?",
};

export default function Home() {
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <IncomeImpact />
    </main>
  );
}
