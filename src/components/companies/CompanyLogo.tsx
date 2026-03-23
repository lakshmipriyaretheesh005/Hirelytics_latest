import type { CompanyData } from "@/data/companies";

type CompanyLogoProps = {
  company: Pick<CompanyData, "id" | "name" | "logo">;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const sizeClasses = {
  sm: "w-16 h-12",
  md: "w-24 h-14",
  lg: "w-40 h-20",
  xl: "w-56 h-28",
};

const imageSizeClasses = {
  sm: "max-h-full max-w-full",
  md: "max-h-full max-w-full",
  lg: "max-h-full max-w-full",
  xl: "max-h-full max-w-full",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-2xl",
};

const PresetLogo = ({ companyId }: { companyId: string }) => {
  if (companyId === "ey") {
    return (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-label="EY logo">
        <polygon points="18,24 108,8 108,28 8,34" fill="#facc15" />
        <text x="18" y="100" fontSize="56" fontWeight="800" fill="#5b5b5f" fontFamily="Arial, sans-serif">
          EY
        </text>
      </svg>
    );
  }

  if (companyId === "infosys") {
    return (
      <svg viewBox="0 0 220 120" className="h-full w-full" aria-label="Infosys logo">
        <text x="10" y="60" fontSize="44" fontWeight="400" fill="#0f82cf" fontFamily="Arial, sans-serif">
          Infosys
        </text>
        <text x="12" y="90" fontSize="18" fontWeight="400" fill="#0f82cf" fontFamily="Arial, sans-serif">
          Navigate your next
        </text>
      </svg>
    );
  }

  if (companyId === "tcs") {
    return (
      <svg viewBox="0 0 260 120" className="h-full w-full" aria-label="TCS logo">
        <defs>
          <linearGradient id="tcsGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>
        <text x="10" y="70" fontSize="60" fontWeight="700" fill="url(#tcsGradient)" fontFamily="Arial, sans-serif">
          tcs
        </text>
        <text x="110" y="40" fontSize="18" fontWeight="700" fill="#0f82cf" fontFamily="Arial, sans-serif">
          TATA
        </text>
        <text x="110" y="60" fontSize="18" fontWeight="700" fill="#0f82cf" fontFamily="Arial, sans-serif">
          CONSULTANCY
        </text>
        <text x="110" y="80" fontSize="18" fontWeight="700" fill="#0f82cf" fontFamily="Arial, sans-serif">
          SERVICES
        </text>
      </svg>
    );
  }

  if (companyId === "ibm") {
    return (
      <svg viewBox="0 0 220 120" className="h-full w-full" aria-label="IBM logo">
        <text x="10" y="86" fontSize="84" fontWeight="800" fill="#1261a6" fontFamily="Arial, sans-serif">
          IBM
        </text>
        {[24, 36, 48, 60, 72, 84, 96].map((y) => (
          <rect key={y} x="0" y={y} width="220" height="6" fill="white" opacity="0.9" />
        ))}
      </svg>
    );
  }

  if (companyId === "google") {
    return (
      <svg viewBox="0 0 520 160" className="h-full w-full" aria-label="Google logo">
        <text x="12" y="118" fontSize="108" fontWeight="500" fill="#4285f4" fontFamily="Arial, sans-serif">
          G
        </text>
        <text x="142" y="118" fontSize="86" fontWeight="500" fill="#ea4335" fontFamily="Arial, sans-serif">
          o
        </text>
        <text x="225" y="118" fontSize="86" fontWeight="500" fill="#fbbc05" fontFamily="Arial, sans-serif">
          o
        </text>
        <text x="305" y="118" fontSize="108" fontWeight="500" fill="#4285f4" fontFamily="Arial, sans-serif">
          g
        </text>
        <text x="402" y="118" fontSize="86" fontWeight="500" fill="#34a853" fontFamily="Arial, sans-serif">
          l
        </text>
        <text x="440" y="118" fontSize="86" fontWeight="500" fill="#ea4335" fontFamily="Arial, sans-serif">
          e
        </text>
      </svg>
    );
  }

  return null;
};

const CompanyLogo = ({ company, size = "md", className = "" }: CompanyLogoProps) => {
  const normalizedId = company.id.toLowerCase();
  const normalizedName = company.name.toLowerCase();
  const presetCompanyId =
    normalizedId.includes("google") || normalizedName.includes("google")
      ? "google"
      : normalizedId.includes("infosys") || normalizedName.includes("infosys")
      ? "infosys"
      : normalizedId.includes("tcs") || normalizedName.includes("tata consultancy")
      ? "tcs"
      : normalizedId.includes("ibm") || normalizedName.includes("ibm")
      ? "ibm"
      : normalizedId.includes("ey") || normalizedName.includes("ernst") || normalizedName.includes(" ey")
      ? "ey"
      : company.id;
  const isImageLogo = company.logo.startsWith("data:image");
  const presetLogo = !isImageLogo ? <PresetLogo companyId={presetCompanyId} /> : null;

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center shrink-0 overflow-hidden bg-transparent ${className}`.trim()}
    >
      {isImageLogo ? (
        <img
          src={company.logo}
          alt={`${company.name} logo`}
          className={`${imageSizeClasses[size]} object-contain bg-transparent`}
        />
      ) : presetLogo ? (
        presetLogo
      ) : (
        <span className={`font-display font-bold text-primary ${textSizeClasses[size]}`}>
          {company.logo}
        </span>
      )}
    </div>
  );
};

export default CompanyLogo;
