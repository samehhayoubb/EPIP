import { DISCIPLINES, docTypeLabel } from "./constants";

// EDIT THESE to match your company's naming codes.
const DISCIPLINE_CODES: Record<string, string> = {
  ARCH: "architecture",
  AR: "architecture",
  ARC: "architecture",
  CIV: "civil",
  CI: "civil",
  ELEC: "electrical",
  EL: "electrical",
  MECH: "mechanical",
  ME: "mechanical",
  GEN: "general",
};

const DOC_TYPE_CODES: Record<string, string> = {
  MIR: "mir",
  IR: "ir",
  RFI: "rfi",
  SUB: "submittal",
  SD: "shop_drawing",
  SHD: "shop_drawing",
  DWG: "drawing",
  SPEC: "specification",
  BOQ: "boq",
  INV: "invoice",
  COR: "correspondence",
  RPT: "report",
};

// PROJECT-DISCIPLINE-TYPE-NUMBER, for example NXT-ELEC-MIR-0002
const PATTERN = /^([A-Z0-9]{2,8})-([A-Z]{2,5})-([A-Z]{2,5})-(\d{1,6})$/;

function normalizeDocumentNumber(number: string): string {
  return number.replace(/^0+(?=\d)/, "");
}

export type ParsedFileName = {
  projectCode: string;
  disciplineCode: string;
  typeCode: string;
  docNumber: string;
  docNumberWidth: number;
  discipline?: string; // undefined when the code isn't recognised
  docType?: string;
};

export function parseFileName(fileName: string): ParsedFileName | null {
  const base = fileName
    .replace(/\.[^.]+$/, "") // remove the extension
    .trim()
    .toUpperCase()
    .replace(/_/g, "-");

  const match = PATTERN.exec(base);
  if (!match) return null;

  const [, projectCode, disciplineCode, typeCode, docNumber] = match;
  return {
    projectCode,
    disciplineCode,
    typeCode,
    docNumber: normalizeDocumentNumber(docNumber),
    docNumberWidth: docNumber.length,
    discipline: DISCIPLINE_CODES[disciplineCode],
    docType: DOC_TYPE_CODES[typeCode],
  };
}

/** Builds the document-code title from the current form values when possible. */
export function suggestTitle(parts: {
  projectCode?: string;
  disciplineCode?: string;
  typeCode?: string;
  docNumberWidth?: number;
  docType: string;
  discipline: string;
  docNumber: string;
  fileBase: string;
}): string {
  const disciplineCode =
    (parts.disciplineCode &&
    DISCIPLINE_CODES[parts.disciplineCode] === parts.discipline
      ? parts.disciplineCode
      : undefined) ??
    Object.entries(DISCIPLINE_CODES).find(
      ([, value]) => value === parts.discipline && value !== "civil",
    )?.[0] ??
    parts.disciplineCode ??
    "";
  const typeCode =
    (parts.typeCode && DOC_TYPE_CODES[parts.typeCode] === parts.docType
      ? parts.typeCode
      : undefined) ??
    Object.entries(DOC_TYPE_CODES).find(([, value]) => value === parts.docType)?.[0] ??
    parts.typeCode ??
    "";
  const number = normalizeDocumentNumber(parts.docNumber.trim());

  if (parts.projectCode && disciplineCode && typeCode && number) {
    const titleNumber = number.padStart(parts.docNumberWidth ?? 0, "0");
    return [parts.projectCode, disciplineCode, typeCode, titleNumber]
      .map((part) => part.toUpperCase())
      .join("-");
  }

  const typeLabel = parts.docType ? docTypeLabel(parts.docType) : "";
  const disciplineLabel =
    DISCIPLINES.find((d) => d.value === parts.discipline)?.label ?? "";
  const reference = number || parts.fileBase;

  return [typeLabel, disciplineLabel, reference].filter(Boolean).join(" · ");
}