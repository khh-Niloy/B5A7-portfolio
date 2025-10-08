export const toArrayConvert = (val: unknown) => {
    if (!val) return [] as string[];
    if (Array.isArray(val)) return val as string[];
    if (typeof val === "string") {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [] as string[];
  };