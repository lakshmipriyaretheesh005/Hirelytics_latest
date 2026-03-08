import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ChevronRight,
  Building2,
  Briefcase,
  TrendingUp,
  Users,
} from 'lucide-react';
import { companiesData } from '../data/companiesData';
import { cn } from '../lib/utils';

export default function CompaniesPage() {
  const [search, setSearch] = useState('');

  // Calculate statistics
  const stats = {
    totalCompanies: companiesData.length,
    avgPackage: (
      companiesData.reduce((sum, c) => {
        const pkg = parseFloat(c.averagePackage?.replace(' LPA', '') || c.roles[0]?.package?.replace(' LPA', '') || 0);
        return sum + pkg;
      }, 0) / companiesData.length
    ).toFixed(2),
    totalPlacements: companiesData.reduce((sum, c) => sum + (c.studentPlaced || 0), 0),
    minCGPA: Math.min(...companiesData.map((c) => c.eligibility.minCGPA)),
  };

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return companiesData;
    return companiesData.filter((company) => {
      const searchable = [company.name, company.industry, ...company.roles]
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    });
  }, [search]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-2">
          Recruiting Partners
        </h1>
        <p className="text-zinc-400">
          Complete information about companies visiting our campus. Prepare with real data from
          previous years.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Building2 className="w-5 h-5" />}
          label="Total Companies"
          value={stats.totalCompanies}
          color="blue"
        />
        <StatCard
          icon={<TrendingUp className="w-5 h-5" />}
          label="Avg. Package"
          value={`₹${stats.avgPackage}L`}
          color="green"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Placements"
          value={stats.totalPlacements}
          color="purple"
        />
        <StatCard
          icon={<Briefcase className="w-5 h-5" />}
          label="Min CGPA"
          value={stats.minCGPA}
          color="amber"
        />
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search companies by name, industry, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition"
        />
      </div>

      {/* Important Note */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex gap-3">
        <div className="text-blue-400 font-black text-lg flex-shrink-0">ℹ</div>
        <div>
          <p className="text-blue-300 font-semibold">Data from Previous Years</p>
          <p className="text-blue-200/80 text-sm mt-1">
            The information below is based on previous year placements. Interview rounds, questions,
            and packages may vary. Use this as a reference and prepare accordingly.
          </p>
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company, index) => (
            <CompanyCard key={company.name} company={company} index={index} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Building2 className="w-12 h-12 text-zinc-700 mb-4" />
            <p className="text-white font-semibold text-lg">No companies found</p>
            <p className="text-zinc-500 mt-1">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
  };

  return (
    <div
      className={cn(
        'rounded-lg border p-4 flex items-start gap-4 transition-all hover:border-opacity-100',
        colorClasses[color]
      )}
    >
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{label}</p>
        <p className="text-2xl font-black mt-1">{value}</p>
      </div>
    </div>
  );
}

function CompanyCard({ company, index }) {
  const rolesText = company.roles.map(r => r.title).slice(0, 2).join(', ');
  const rolesMore = company.roles.length > 2 ? ` +${company.roles.length - 2} more` : '';
  const packageAmount = company.averagePackage || company.roles[0]?.package || 'N/A';
  const roundsCount = company.selectionProcess?.rounds?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/companies/${company.name.toLowerCase()}`}>
        <div className="group h-full bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl border border-zinc-700 hover:border-blue-500/50 overflow-hidden transition-all cursor-pointer hover:shadow-xl hover:shadow-blue-500/10">
          {/* Header Background */}
          <div className="h-24 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-zinc-700" />

          <div className="p-6">
            {/* Company Name and Badge */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">
                  {company.name}
                </h3>
                <p className="text-sm text-zinc-400 mt-1">{company.industry}</p>
              </div>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Package
                </p>
                <p className="text-lg font-black text-emerald-400 mt-1">
                  {packageAmount}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Min CGPA
                </p>
                <p className="text-lg font-black text-blue-400 mt-1">
                  {company.eligibility.minCGPA}+
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Roles
                </p>
                <p className="text-sm text-zinc-300 mt-1">
                  {rolesText}
                  {rolesMore && <span className="text-zinc-500">{rolesMore}</span>}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Rounds
                </p>
                <p className="text-lg font-black text-purple-400 mt-1">
                  {roundsCount}
                </p>
              </div>
            </div>

            {/* Branches */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Branches
              </p>
              <div className="flex flex-wrap gap-2">
                {company.eligibility.branches.map((branch) => (
                  <span
                    key={branch}
                    className="px-2 py-1 text-xs font-semibold bg-zinc-800 text-zinc-300 rounded border border-zinc-700 group-hover:border-blue-500/30 transition-colors"
                  >
                    {branch}
                  </span>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="mb-4 pb-4 border-b border-zinc-800">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                Timeline
              </p>
              <p className="text-sm text-zinc-300">{company.interviewTimeline}</p>
            </div>

            {/* View Details Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors group-hover:shadow-lg group-hover:shadow-blue-600/50">
              View Details <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
