import React from "react";
import { Check } from "lucide-react";

export default function Education({ content }: { content: Record<string, unknown> }) {
  const { education, sampleText } = content;
  const { varsity, department, startYear, endYear } = education as Record<string, unknown>;
  return (
    <div className="flex gap-2">
      <div className="px-5 py-5 w-[60%]">
        <h1 className="text-2xl font-semibold text-white">
          Education <span className="text-3xl">🎓</span>
        </h1>
        <div className="text-white space-y-2 mt-3">
          <h2 className="text-lg font-semibold">{varsity as string}</h2>
          <p className="text-sm text-gray-300">{department as string}</p>
          <p className="text-sm text-gray-500 italic">
            {startYear as string} - {endYear as string}
          </p>
        </div>
      </div>

      <div className="w-[40%] text-white my-auto">
        {(sampleText as string[]).map((e: string, index: number) => (
          <div key={index} className="list-none space-y-2">
            <div className="flex items-start justify-start gap-2">
              {" "}
              <Check className="text-green-500 w-4 h-4 mt-2" /> {e}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
