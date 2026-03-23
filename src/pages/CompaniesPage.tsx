import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import StudentHeader from "@/components/dashboard/StudentHeader";
import { Building2, ExternalLink, Search, SlidersHorizontal, Users, TrendingUp, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CompanyData } from "@/data/companies";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { getCompanies } from "@/lib/adminData";
import CompanyLogo from "@/components/companies/CompanyLogo";

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cgpaFilter, setCgpaFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const { ref: statsRef, isVisible: statsVisible } = useScrollReveal(0.1);

  useEffect(() => {
    setCompanies(getCompanies());
  }, []);

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (cgpaFilter !== "all") {
        const max = parseFloat(cgpaFilter);
        if (c.minCgpa > max) return false;
      }
      if (packageFilter !== "all") {
        const min = parseFloat(packageFilter);
        if (c.packageLpa < min) return false;
      }
      return true;
    });
  }, [companies, search, statusFilter, cgpaFilter, packageFilter]);

  const totalCompanies = companies.length || 1;
  const avgPackage = (companies.reduce((s, c) => s + c.packageLpa, 0) / totalCompanies).toFixed(1);
  const activeCount = companies.filter((c) => c.status === "Active").length;

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <main className="container mx-auto section-padding py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground mb-1">Companies</h1>
            <p className="text-muted-foreground">
              Browse recruiting companies and check eligibility.{" "}
              <a
                href="https://mgmits.ac.in/placement#PlacementStatistics"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline text-sm font-medium"
              >
                View previous stats <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          ref={statsRef}
          className={`grid grid-cols-3 gap-4 mb-8 ${statsVisible ? "animate-fade-up" : "opacity-0"}`}
        >
          <div className="p-5 rounded-2xl border border-border bg-card text-center">
            <Briefcase className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-display font-bold text-2xl tabular-nums text-foreground">{companies.length}</p>
            <p className="text-xs text-muted-foreground">Total Companies</p>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card text-center">
            <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-display font-bold text-2xl tabular-nums text-foreground">₹{avgPackage}L</p>
            <p className="text-xs text-muted-foreground">Average Package</p>
          </div>
          <div className="p-5 rounded-2xl border border-border bg-card text-center">
            <Users className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-display font-bold text-2xl tabular-nums text-foreground">{activeCount}</p>
            <p className="text-xs text-muted-foreground">Active Companies</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <div className="flex gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-10">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={cgpaFilter} onValueChange={setCgpaFilter}>
              <SelectTrigger className="w-[130px] h-10">
                <SelectValue placeholder="CGPA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any CGPA</SelectItem>
                <SelectItem value="6.0">≤ 6.0</SelectItem>
                <SelectItem value="6.5">≤ 6.5</SelectItem>
                <SelectItem value="7.0">≤ 7.0</SelectItem>
                <SelectItem value="7.5">≤ 7.5</SelectItem>
                <SelectItem value="8.0">≤ 8.0</SelectItem>
              </SelectContent>
            </Select>

            <Select value={packageFilter} onValueChange={setPackageFilter}>
              <SelectTrigger className="w-[130px] h-10">
                <SelectValue placeholder="Package" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Package</SelectItem>
                <SelectItem value="3">≥ ₹3 LPA</SelectItem>
                <SelectItem value="5">≥ ₹5 LPA</SelectItem>
                <SelectItem value="6">≥ ₹6 LPA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Company cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">No companies match your filters.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((c) => (
              <Link
                key={c.id}
                to={`/companies/${c.id}`}
                className="group p-5 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 block"
              >
                {/* Logo */}
                <CompanyLogo company={c} size="sm" className="mb-4" />

                <h3 className="font-display font-semibold text-foreground mb-1 text-sm">{c.name}</h3>
                <p className="text-xs text-muted-foreground mb-1">₹{c.packageLpa} LPA · Min CGPA {c.minCgpa}</p>
                <p className="text-xs text-muted-foreground mb-3">{c.roles[0]}</p>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      c.status === "Active"
                        ? "bg-primary/10 text-primary"
                        : c.status === "Upcoming"
                        ? "bg-accent text-accent-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {c.status === "Active" ? "🟢 Active Drive" : c.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CompaniesPage;
