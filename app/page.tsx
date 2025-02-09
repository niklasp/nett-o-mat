import IncomeImpact from "@/components/income-impact";
export default function Home() {
  return (
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <IncomeImpact />
    </main>
  );
}
