"use client";

import Enter from "@/components/ui/Enter";
import CTAButton from "@/components/ui/CTAButton";
import { useRegisterCTA } from "@/hooks/useRegisterCTA";

export default function SinopsisCTA() {
  const ref = useRegisterCTA("sinopsis-cta");

  return (
    <div ref={ref} data-cta-block>
      <Enter className="flex flex-col sm:flex-row gap-3 pt-4">
        <CTAButton />
      </Enter>
    </div>
  );
}
