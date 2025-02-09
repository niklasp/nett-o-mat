import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SiGithub } from "@icons-pack/react-simple-icons";

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="container px-4 py-12 mx-auto">
        <Separator className="mb-8" />
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Link href="/" className="text-2xl font-bold">
              Nett-O-Mat
            </Link>
            <p className="text-sm text-muted-foreground"></p>
          </div>
          <div className="flex flex-col items-center gap-2 sm:items-start text-xs">
            <p>
              Alle Angaben ohne Gewähr. Die Werte basieren{" "}
              <Link
                href="https://ftp.zew.de/pub/zew-docs/gutachten/Bundestagswahlprogramme_ZEW_2025.pdf"
                className="underline"
              >
                auf einer Studie vom ZEW
              </Link>{" "}
              vom 20. Januar 2025.
            </p>
          </div>
          <nav className="flex gap-6">
            <Link href="/about" className="text-sm hover:underline">
              Über
            </Link>
            <Link
              href="mailto:info@nett-o-mat.de"
              className="text-sm hover:underline"
            >
              Kontakt
            </Link>
            <Link
              href="https://github.com/nett-o-mat/nett-o-mat"
              className="text-sm hover:underline flex items-center gap-2"
            >
              Code
              <SiGithub className="w-3 h-3" />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
