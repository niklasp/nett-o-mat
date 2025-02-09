"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface IncomeBracket {
  min: number;
  max: number;
  label: BracketLabel;
}

type BracketLabel =
  | "1-10k"
  | "10-20k"
  | "20-30k"
  | "30-40k"
  | "40-55k"
  | "55-80k"
  | "80-100k"
  | "100-150k"
  | "150-250k"
  | "250k+";

interface PartyValues {
  percentage: number;
  absolute: number;
}

interface PartyImpacts {
  [bracket: string]: {
    [party: string]: PartyValues;
  };
}

const incomeBrackets: IncomeBracket[] = [
  { min: 0, max: 10000, label: "1-10k" },
  { min: 10001, max: 20000, label: "10-20k" },
  { min: 20001, max: 30000, label: "20-30k" },
  { min: 30001, max: 40000, label: "30-40k" },
  { min: 40001, max: 55000, label: "40-55k" },
  { min: 55001, max: 80000, label: "55-80k" },
  { min: 80001, max: 100000, label: "80-100k" },
  { min: 100001, max: 150000, label: "100-150k" },
  { min: 150001, max: 250000, label: "150-250k" },
  { min: 250001, max: Infinity, label: "250k+" },
];

const partyImpacts: PartyImpacts = {
  "1-10k": {
    SPD: { percentage: 1.9, absolute: 268 },
    CDU: { percentage: 0.1, absolute: 11 },
    Grüne: { percentage: 0.9, absolute: 119 },
    FDP: { percentage: -2.1, absolute: -289 },
    AfD: { percentage: 0.0, absolute: 1000 },
    Linke: { percentage: 29.7, absolute: 4125 },
    BSW: { percentage: 0.5, absolute: 75 },
  },
  "10-20k": {
    SPD: { percentage: 2.4, absolute: 373 },
    CDU: { percentage: 0.1, absolute: 13 },
    Grüne: { percentage: 2.8, absolute: 437 },
    FDP: { percentage: -0.2, absolute: -36 },
    AfD: { percentage: 0.2, absolute: 1000 },
    Linke: { percentage: 12.4, absolute: 1936 },
    BSW: { percentage: 1.4, absolute: 224 },
  },
  "20-30k": {
    SPD: { percentage: 3.1, absolute: 682 },
    CDU: { percentage: 0.3, absolute: 63 },
    Grüne: { percentage: 3.9, absolute: 846 },
    FDP: { percentage: 1.4, absolute: 292 },
    AfD: { percentage: 1.1, absolute: 1000 },
    Linke: { percentage: 8.5, absolute: 1846 },
    BSW: { percentage: 3.0, absolute: 654 },
  },
  "30-40k": {
    SPD: { percentage: 2.8, absolute: 795 },
    CDU: { percentage: 0.6, absolute: 176 },
    Grüne: { percentage: 3.6, absolute: 1033 },
    FDP: { percentage: 2.3, absolute: 663 },
    AfD: { percentage: 1.7, absolute: 1000 },
    Linke: { percentage: 6.4, absolute: 1840 },
    BSW: { percentage: 2.8, absolute: 820 },
  },
  "40-55k": {
    SPD: { percentage: 2.5, absolute: 926 },
    CDU: { percentage: 1.1, absolute: 414 },
    Grüne: { percentage: 3.1, absolute: 1140 },
    FDP: { percentage: 3.7, absolute: 1379 },
    AfD: { percentage: 2.8, absolute: 1000 },
    Linke: { percentage: 6.4, absolute: 2378 },
    BSW: { percentage: 2.9, absolute: 1083 },
  },
  "55-80k": {
    SPD: { percentage: 2.6, absolute: 1281 },
    CDU: { percentage: 1.8, absolute: 907 },
    Grüne: { percentage: 2.1, absolute: 1055 },
    FDP: { percentage: 5.5, absolute: 2758 },
    AfD: { percentage: 4.9, absolute: 1000 },
    Linke: { percentage: 6.7, absolute: 3316 },
    BSW: { percentage: 3.0, absolute: 1474 },
  },
  "80-100k": {
    SPD: { percentage: 2.3, absolute: 1438 },
    CDU: { percentage: 2.4, absolute: 1528 },
    Grüne: { percentage: 1.4, absolute: 867 },
    FDP: { percentage: 6.8, absolute: 4378 },
    AfD: { percentage: 6.1, absolute: 1000 },
    Linke: { percentage: 5.5, absolute: 3500 },
    BSW: { percentage: 2.3, absolute: 1482 },
  },
  "100-150k": {
    SPD: { percentage: 1.7, absolute: 1360 },
    CDU: { percentage: 3.2, absolute: 2587 },
    Grüne: { percentage: 0.7, absolute: 585 },
    FDP: { percentage: 8.2, absolute: 6734 },
    AfD: { percentage: 6.7, absolute: 1000 },
    Linke: { percentage: 2.7, absolute: 2189 },
    BSW: { percentage: 1.3, absolute: 1033 },
  },
  "150-250k": {
    SPD: { percentage: 1.0, absolute: 1179 },
    CDU: { percentage: 4.4, absolute: 5203 },
    Grüne: { percentage: -0.1, absolute: -122 },
    FDP: { percentage: 9.8, absolute: 11543 },
    AfD: { percentage: 7.7, absolute: 1000 },
    Linke: { percentage: -3.0, absolute: -3547 },
    BSW: { percentage: 0.1, absolute: 107 },
  },
  "250k+": {
    SPD: { percentage: -3.4, absolute: -8892 },
    CDU: { percentage: 5.1, absolute: 13248 },
    Grüne: { percentage: -3.8, absolute: -9833 },
    FDP: { percentage: 8.1, absolute: 21083 },
    AfD: { percentage: 7.7, absolute: 1000 },
    Linke: { percentage: -27.0, absolute: -70679 },
    BSW: { percentage: -2.2, absolute: -5767 },
  },
};

const povertyRiskImpacts: Record<string, number> = {
  Linke: -15.9,
  Grüne: -5.0,
  SPD: 0.5,
  CDU: 2.9,
  BSW: 4.2,
  FDP: 11.0,
  AfD: 12.9,
};

interface ChartDataPoint {
  party: keyof PartyImpacts;
  impact: number;
  fill: string;
}

const chartConfig = {
  impact: {
    label: "Auswirkung",
    color: "transparent",
  },
  SPD: {
    label: "SPD",
    color: "hsl(357, 100%, 45%)", // #E3000F
    umverteilung: 0.5,
  },
  CDU: {
    label: "CDU",
    color: "hsl(0, 0%, 0%)", // #000000
    umverteilung: 2.9,
  },
  Grüne: {
    label: "Die Grünen",
    color: "hsl(104, 57%, 38%)", // #46962b
    umverteilung: -5,
  },
  FDP: {
    label: "FDP",
    color: "hsl(56, 100%, 50%)", // #FFED00
    umverteilung: 11,
  },
  AfD: {
    label: "AfD",
    color: "hsl(201, 100%, 44%)", // #009EE0
    umverteilung: 12.9,
  },
  Linke: {
    label: "Die Linke",
    color: "hsl(333, 70%, 50%)", // #BE3075
    umverteilung: -15.9,
  },
  BSW: {
    label: "BSW",
    color: "hsl(30 80% 55%)", // #009EE0
    umverteilung: 4.2,
  },
} satisfies ChartConfig;

function getOrderedParties(
  impacts: PartyImpacts,
  bracket: string,
  showAbsolute: boolean
): string[] {
  if (!bracket) return [];
  const bracketImpacts = impacts[bracket as keyof PartyImpacts];
  return Object.entries(bracketImpacts)
    .sort(([, a], [, b]) => {
      const valueA = showAbsolute ? a.absolute : a.percentage;
      const valueB = showAbsolute ? b.absolute : b.percentage;
      return valueB - valueA;
    })
    .map(([party]) => party);
}

export default function IncomeImpact() {
  const [selectedBracket, setSelectedBracket] = useState<BracketLabel | null>(
    null
  );
  const [view, setView] = useState<"parties" | "brackets">("parties");
  const [showAbsolute, setShowAbsolute] = useState<boolean>(true);
  const [hoveredParty, setHoveredParty] = useState<string | null>(null);

  console.log("selectedBracket", selectedBracket);
  console.log(
    "selectedBracket",
    partyImpacts[selectedBracket as keyof PartyImpacts]
  );

  const orderedParties = useMemo(
    () =>
      getOrderedParties(partyImpacts, selectedBracket as string, showAbsolute),
    [partyImpacts, selectedBracket, showAbsolute]
  );

  const chartData: ChartDataPoint[] = useMemo(
    () =>
      orderedParties.map((party) => ({
        party: party as keyof PartyImpacts,
        impact: showAbsolute
          ? partyImpacts[selectedBracket as keyof PartyImpacts][
              party as keyof PartyImpacts
            ].absolute
          : partyImpacts[selectedBracket as keyof PartyImpacts][
              party as keyof PartyImpacts
            ].percentage,
        fill: chartConfig[party as keyof typeof chartConfig]?.color,
      })),
    [orderedParties, selectedBracket, partyImpacts, chartConfig]
  );

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 max-w-4xl ">
      <h1 className="text-2xl font-bold mb-6 sm:mb-8">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500 text-5xl block">
          Verteil-O-Mat
        </span>
        <br />
        Auswirkungen der Bundestagswahl am 23.02.2025 auf Ihr Einkommen
      </h1>

      <div className="mb-8 sm:mb-10">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          Wählen Sie Ihr jährliches
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger className="inline-flex items-center">
                Haushaltsbruttoeinkommen
                <Info className="h-4 w-4 text-gray-500 hover:text-gray-700 ml-1 " />{" "}
              </TooltipTrigger>
              <TooltipContent className="max-w-xs border text-sm border-gray-200 rounded-lg p-3 bg-white text-black">
                Das Haushaltsbruttoeinkommen ist die Summe aller Einkünfte in
                Ihrem Haushalt vor Abzug von Steuern und Sozialabgaben.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h2>
        {/* <RadioGroup
          defaultValue="parties"
          onValueChange={(value) => setView(value as "parties" | "brackets")}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="parties" id="parties" />
            <Label htmlFor="parties">Nach Parteien</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="brackets" id="brackets" />
            <Label htmlFor="brackets">Nach Einkommensgruppen</Label>
          </div>
        </RadioGroup> */}
        {view === "parties" ? (
          <RadioGroup
            value={selectedBracket || ""}
            onValueChange={(value) => {
              console.log("value", value);
              setView("brackets");
              setSelectedBracket((value as BracketLabel) || null);
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2"
          >
            {incomeBrackets.map((bracket) => (
              <Label
                key={bracket.label}
                htmlFor={bracket.label}
                className={`
                group relative p-4 sm:p-5 rounded-lg border-2 block cursor-pointer
                ${
                  selectedBracket === bracket.label
                    ? "border-gray-500 bg-gray-50"
                    : "border-gray-200 hover:border-gray-200"
                }
                transition-colors
              `}
              >
                <RadioGroupItem
                  value={bracket.label}
                  id={bracket.label}
                  className="absolute left-4 top-4 sm:left-5 sm:top-5"
                />
                <div className="pl-8 sm:pl-9">
                  <div className="font-medium">
                    {bracket.max === Infinity
                      ? `Über ${(bracket.min - 1).toLocaleString("de-DE")}€`
                      : `${bracket.min.toLocaleString(
                          "de-DE"
                        )}€ - ${bracket.max.toLocaleString("de-DE")}€`}
                  </div>
                </div>
              </Label>
            ))}
          </RadioGroup>
        ) : (
          <div className="flex items-center gap-2">
            <Select
              value={selectedBracket || ""}
              onValueChange={(value) => {
                setSelectedBracket((value as BracketLabel) || null);
              }}
            >
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Einkommensgruppe wählen" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(partyImpacts).map((bracket) => (
                  <SelectItem key={bracket} value={bracket}>
                    {bracket.replace("k", ".000")} €
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Switch
                checked={showAbsolute}
                onCheckedChange={setShowAbsolute}
                id="value-type"
              />
              <Label htmlFor="value-type">
                {showAbsolute
                  ? "Absolute Werte (€)"
                  : "Prozentuale Änderung (%)"}
              </Label>
            </div>
          </div>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="flex flex-col gap-4 relative  mx-auto">
          <span className="absolute text-sm -rotate-90 -left-[130px] top-1/2 -translate-y-full">
            {showAbsolute
              ? "Veränderung im verfügbaren Einkommen in €"
              : "Veränderung im verfügbaren Einkommen in %"}
          </span>
          <ChartContainer
            config={chartConfig}
            className="w-full min-h-[400px]"
            key={showAbsolute.toString()}
          >
            <ResponsiveContainer width="100%" height={400} minHeight={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, bottom: 20, left: 60 }}
                onMouseMove={(data) => {
                  if (data && data.activePayload) {
                    const party = data.activePayload[0].payload
                      .party as keyof PartyImpacts;
                    setHoveredParty(party as string);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredParty(null);
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="party"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => {
                    return chartConfig[value as keyof typeof chartConfig]
                      ?.label;
                  }}
                />
                <YAxis tickLine={false} axisLine={false} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value, name, payload) => {
                    const party = payload?.payload?.party as keyof PartyImpacts;
                    const impact = payload?.payload?.impact as number;
                    return (
                      <div className="max-w-[380px] text-sm p-3">
                        <h4 className="font-bold mb-2">{party}</h4>
                        <p>
                          {" "}
                          Ihr durchschnittliches verfügbares Jahreseinkommen{" "}
                          <b>{impact > 0 ? "steigt" : "sinkt"}</b>{" "}
                          <b>
                            um {Math.abs(impact)} {showAbsolute ? "€" : "%"}
                          </b>
                          , wenn sie bei der Bundestagswahl am 23.02.2025 die{" "}
                          {party} wählen,
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="impact" fill="fill" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      )}
      {/* Add inequality reduction indicator */}
      {hoveredParty && (
        <div className="rounded-lg bg-muted p-4">
          <h3 className="font-semibold mb-2">
            Das Armutsrisiko in Deutschland durch Wahl von{" "}
            <span className=" text-muted-foreground ">
              {chartConfig[hoveredParty as keyof typeof chartConfig]?.label}:{" "}
            </span>
            <span
              className={cn(
                "text-muted-foreground",
                hoveredParty && povertyRiskImpacts[hoveredParty] > 0
                  ? "text-red-500"
                  : "text-green-500"
              )}
            >
              {povertyRiskImpacts[
                hoveredParty as keyof typeof povertyRiskImpacts
              ] > 0
                ? "steigt um "
                : "sinkt um "}
              {Math.abs(
                povertyRiskImpacts[
                  hoveredParty as keyof typeof povertyRiskImpacts
                ]
              )}
              %
            </span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Die Armutsrisikoquote ist ein Maß für die Anzahl der Menschen, die
            unterhalb der Armutsgrenze leben und gibt an, wie sich durch die
            Wahl einer bestimmten Partei das Armutsrisiko prozentual verändert.
          </p>
        </div>
      )}
    </div>
  );
}
