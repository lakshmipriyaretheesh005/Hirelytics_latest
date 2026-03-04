'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  Building2, 
  Search, 
  Filter, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Bookmark,
  ChevronDown,
  LayoutGrid,
  List,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState('All Status')
  const supabase = createClient()

  useEffect(() => {
    async function getCompanies() {
      let query = supabase.from('companies').select('*')
      
      if (search) {
        query = query.ilike('name', `%${search}%`)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (!error) {
        setCompanies(data)
      }
      setLoading(false)
    }
    getCompanies()
  }, [search])

  const filteredCompanies = companies.filter(c => {
    if (filter === 'All Status') return true
    return c.status === filter.toLowerCase()
  })

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Company Explore</h1>
          <p className="text-zinc-500 font-medium">Find your dream role from 100+ global recruiters.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className={cn("border-zinc-800", view === 'grid' ? "bg-zinc-800 text-blue-500" : "text-zinc-500")}
            onClick={() => setView('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={cn("border-zinc-800", view === 'list' ? "bg-zinc-800 text-blue-500" : "text-zinc-500")}
            onClick={() => setView('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search by company name, role or location..." 
            className="pl-10 h-11 bg-zinc-900 border-zinc-800 focus:ring-blue-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="md:col-span-4 flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 border-zinc-800 bg-zinc-900 text-zinc-400 w-full flex justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {filter}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white w-48">
              <DropdownMenuItem onClick={() => setFilter('All Status')}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Open')}>Open</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Upcoming')}>Upcoming</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Closed')}>Closed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-zinc-900 rounded-xl animate-pulse" />)}
          </div>
        ) : filteredCompanies.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              view === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                : "flex flex-col gap-4"
            )}
          >
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} view={view} />
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
  )
}

function CompanyCard({ company, view }: any) {
  return (
    <motion.div layout>
      <Card className={cn(
        "bg-zinc-900 border-zinc-800 transition-all hover:border-blue-500/30 group cursor-pointer overflow-hidden shadow-lg",
        view === 'list' && "flex items-center"
      )}>
        <CardContent className={cn("p-6", view === 'list' && "flex-1 flex items-center justify-between py-4")}>
          <div className={cn("flex gap-4 items-start", view === 'list' && "items-center")}>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 shadow-inner shrink-0 overflow-hidden">
              <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-black text-white group-hover:text-blue-500 transition-colors truncate">{company.name}</h3>
                {view === 'grid' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-blue-500 -mr-2">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <p className="text-sm font-bold text-zinc-300 truncate">{company.role_name}</p>
              <p className="text-xs text-zinc-500 font-medium flex items-center gap-1 mt-1 uppercase tracking-wider">
                <span className="text-blue-500 font-black">{company.package_amount}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {company.location}</span>
              </p>
            </div>
          </div>

          <div className={cn("mt-6 pt-4 border-t border-zinc-800/50 flex items-center justify-between", view === 'list' && "mt-0 pt-0 border-t-0 flex-shrink-0 gap-6")}>
            <div className="flex flex-wrap gap-2">
              <Badge className={cn(
                "border-none text-[10px] px-2 py-0 font-black tracking-widest",
                company.status === 'open' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              )}>
                {company.status.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] px-2 py-0 uppercase tracking-widest">
                CGPA: {company.eligibility_cgpa}
              </Badge>
            </div>
            <Link href={`/companies/${company.id}`}>
              <Button size="sm" variant="ghost" className="text-zinc-500 hover:text-white group-hover:bg-blue-600 group-hover:text-white transition-all h-8 rounded-lg font-bold">
                View Details <ChevronRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-all" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
