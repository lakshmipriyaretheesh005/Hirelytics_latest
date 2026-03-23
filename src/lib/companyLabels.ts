export const getCanonicalCompanyLabel = (value: string) => {
  const normalized = value.toLowerCase();

  if (normalized.includes("google")) return "Google";
  if (normalized.includes("infosys")) return "Infosys";
  if (normalized.includes("ibm")) return "IBM";
  if (normalized.includes("tcs") || normalized.includes("tata consultancy")) return "TCS";
  if (normalized.includes("ey") || normalized.includes("ernst")) return "EY";

  return value.trim();
};
