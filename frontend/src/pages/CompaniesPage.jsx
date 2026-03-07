import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronRight,
  MapPin,
  Bookmark,
  ChevronDown,
  LayoutGrid,
  List,
  AlertCircle,
  Building2,
  Star,
} from 'lucide-react';
import apiClient from '../utils/apiClient';
import { cn } from '../lib/utils';

const fallbackCompanies = [
  {
    _id: 'fallback-1',
    name: 'Google',
    industry: 'Product Engineering',
    location: 'Bangalore',
    rating: 4.8,
    isActive: true,
    tags: ['SDE', 'Product Based'],
    eligibilityCriteria: { minCGPA: 7.5 },
  },
  {
    _id: 'fallback-2',
    name: 'Microsoft',
    industry: 'Cloud & AI',
    location: 'Hyderabad',
    rating: 4.7,
    isActive: true,
    tags: ['SWE', 'Cloud'],
    eligibilityCriteria: { minCGPA: 7.0 },
  },
  {
    _id: 'fallback-3',
    name: 'Amazon',
    industry: 'E-commerce Technology',
    location: 'Pune',
    rating: 4.6,
    isActive: true,
    tags: ['Backend', 'Systems'],
    eligibilityCriteria: { minCGPA: 7.0 },
  },
];

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const [filter, setFilter] = useState('All Status');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Use all companies to match original explore view and avoid profile-gated empty states.
        const response = await apiClient.get('/companies');
        const apiCompanies = response.data.companies || [];
        setCompanies(apiCompanies.length > 0 ? apiCompanies : fallbackCompanies);
      } catch (error) {
        console.error('Failed to fetch companies:', error);
        setCompanies(fallbackCompanies);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    const q = search.trim().toLowerCase();
    return companies.filter((company) => {
      const searchable = [
        company.name,
        company.industry,
        company.location,
        ...(company.tags || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchesSearch = q ? searchable.includes(q) : true;
      const status = company.isActive ? 'open' : 'closed';
      const matchesFilter = filter === 'All Status' ? true : status === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [companies, search, filter]);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Company Explore</h1>
          <p className="text-zinc-500 font-medium">Find your dream role from top recruiters.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              'h-10 w-10 rounded-md border border-zinc-800 flex items-center justify-center transition-colors',
              view === 'grid' ? 'bg-zinc-800 text-blue-500' : 'text-zinc-500 hover:text-white'
            )}
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            className={cn(
              'h-10 w-10 rounded-md border border-zinc-800 flex items-center justify-center transition-colors',
              view === 'list' ? 'bg-zinc-800 text-blue-500' : 'text-zinc-500 hover:text-white'
            )}
            onClick={() => setView('list')}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <input
            placeholder="Search by company name, industry or location..."
            className="w-full pl-10 pr-4 h-11 bg-zinc-900 border border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="md:col-span-4 relative">
          <Filter className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-zinc-500 pointer-events-none" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full h-11 pl-10 pr-10 bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 appearance-none"
          >
            <option>All Status</option>
            <option>Open</option>
            <option>Closed</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredCompanies.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'
            )}
          >
            {filteredCompanies.map((company) => (
              <CompanyCard key={company._id} company={company} view={view} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800">
              <AlertCircle className="w-8 h-8 text-zinc-700" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">No companies found</p>
              <p className="text-zinc-500">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompanyCard({ company, view }) {
  const status = company.isActive ? 'open' : 'closed';

  return (
    <motion.div layout>
      <div
        className={cn(
          'bg-zinc-900 border border-zinc-800 transition-all hover:border-blue-500/30 group cursor-pointer overflow-hidden rounded-xl shadow-lg',
          view === 'list' && 'flex items-center'
        )}
      >
        <div className={cn('p-6', view === 'list' && 'flex-1 flex items-center justify-between py-4')}>
          <div className={cn('flex gap-4 items-start', view === 'list' && 'items-center')}>
            <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-6 h-6 text-zinc-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-black text-white group-hover:text-blue-500 transition-colors truncate">{company.name}</h3>
                {view === 'grid' && (
                  <button type="button" className="h-8 w-8 text-zinc-600 hover:text-blue-500 -mr-2">
                    <Bookmark className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm font-bold text-zinc-300 truncate">{company.industry || 'General Hiring'}</p>
              <p className="text-xs text-zinc-500 font-medium flex items-center gap-1 mt-1 uppercase tracking-wider">
                {company.rating ? (
                  <span className="flex items-center gap-1 text-amber-400"><Star className="w-3 h-3" /> {company.rating.toFixed(1)}</span>
                ) : (
                  <span className="text-blue-500 font-black">NEW</span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {company.location || 'Campus Drive'}</span>
              </p>
            </div>
          </div>

          <div className={cn('mt-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between', view === 'list' && 'mt-0 pt-0 border-t-0 flex-shrink-0 gap-6')}>
            <div className="flex flex-wrap gap-2">
              <span className={cn('text-[10px] px-2 py-1 font-black tracking-widest rounded', status === 'open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-400')}>
                {status.toUpperCase()}
              </span>
              {company.eligibilityCriteria?.minCGPA ? (
                <span className="border border-zinc-800 text-zinc-500 text-[10px] px-2 py-1 uppercase tracking-widest rounded">
                  CGPA: {company.eligibilityCriteria.minCGPA}
                </span>
              ) : null}
            </div>
            <button type="button" className="text-zinc-500 hover:text-white group-hover:bg-blue-600 group-hover:text-white transition-all h-8 rounded-lg font-bold px-2 inline-flex items-center">
              View Details <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
