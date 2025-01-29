import { Check, X } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const features = [
  {
    name: "Syllabus Parsing",
    pdx: "Parses and structures syllabus automatically",
    chatgpt: "Needs manual topic breakdown",
  },
  {
    name: "Tailored materials",
    pdx: "Gives detailed, ready made materials",
    chatgpt: "Need to learn prompt engineering",
  },
  {
    name: "Context Handling",
    pdx: "One shot material generation",
    chatgpt: "Need to prompt multiple times",
  },
  {
    name: "Ease of Use",
    pdx: "Predefined workflows for study material",
    chatgpt: "Requires technical prompts and customization",
  },
  {
    name: "Affordable Pricing",
    pdx: "Flexible credit-based plans",
    chatgpt: "Higher and less predictable costs",
  },
  {
    name: "Time Efficiency",
    pdx: "Instant materials in minutes",
    chatgpt: "Requires multiple interactions and refinements",
  },
  {
    name: "PDF Generation",
    pdx: "Professionally designed, downloadable PDFs",
    chatgpt: "No built-in PDF creation",
  },
];

export default function ComparisonTable() {
  return (
    <Card className="mx-auto w-full max-w-4xl border-[#c3c3c3]/50 bg-[#131111] shadow-[0_0_40px_#04D31C]">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-brand-heading">
          Feature Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-[#c3c3c3]/50">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-[#c3c3c3]/50 bg-black">
                <TableHead className="text-bg-text w-[200px]">
                  Feature
                </TableHead>
                <TableHead className="text-bg-text text-center">PDX</TableHead>
                <TableHead className="text-bg-text text-center">
                  ChatGPT
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow
                  key={feature.name}
                  className="text-bg-text group border-b border-[#c3c3c3]/50 bg-[#131111] last:border-b-0 hover:bg-[#131111]/50"
                >
                  <TableCell className="font-medium">
                    • {feature.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-4 items-center justify-center rounded-full bg-[#03D31C]/20 backdrop-blur-sm lg:size-5">
                        <Check className="size-4 text-[#03D31C]" />
                      </div>
                      <span className="text-bg-text text-sm">
                        {feature.pdx}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex size-4 items-center justify-center rounded-full bg-[#576265] lg:size-4">
                        <X className="size-4 text-[#353535]" />
                      </div>
                      <span className="text-bg-text text-sm">
                        {feature.chatgpt}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
