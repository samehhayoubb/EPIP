export const DOC_TYPES = [
  { value: "mir", label: "MIR" },
  { value: "ir", label: "IR" },
  { value: "rfi", label: "RFI" },
  { value: "submittal", label: "Submittal" },
  { value: "shop_drawing", label: "Shop drawing" },
  { value: "drawing", label: "Drawing" },
  { value: "specification", label: "Specification" },
  { value: "boq", label: "BOQ" },
  { value: "invoice", label: "Invoice" },
  { value: "correspondence", label: "Correspondence" },
  { value: "report", label: "Report" },
  { value: "other", label: "Other" },
] as const;

export const DISCIPLINES = [
  { value: "architecture", label: "Architecture" },
  { value: "electrical", label: "Electrical" },
  { value: "mechanical", label: "Mechanical" },
  { value: "general", label: "General" },
] as const;

export function docTypeLabel(value: string): string {
  return DOC_TYPES.find((t) => t.value === value)?.label ?? value;
}