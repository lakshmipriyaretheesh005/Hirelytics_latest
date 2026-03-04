'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  Building2, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  ExternalLink,
  Filter,
  ChevronDown,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function fetchCompanies() {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error) {
        setCompanies(data)
      }
      setLoading(false)
    }
    fetchCompanies()
  }, [])

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.role_name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this company?')) return
    
    const { error } = await supabase.from('companies').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete company')
    } else {
      toast.success('Company deleted')
      setCompanies(companies.filter(c => c.id !== id))
    }
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Manage Companies</h1>
          <p className="text-zinc-500 font-medium">Add, edit, and track recruitment drives.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6">
          <Plus className="w-4 h-4 mr-2" /> Add Company
        </Button>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex flex-col md:row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search companies or roles..." 
              className="pl-10 h-10 bg-zinc-950 border-zinc-800 focus:ring-blue-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="border-zinc-800 text-zinc-400 h-10 w-full md:w-auto">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" className="border-zinc-800 text-zinc-400 h-10 w-full md:w-auto">
              <ChevronDown className="w-4 h-4 mr-2" /> Status
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Company</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Role</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Package</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Eligibility</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1,2,3,4,5].map(i => (
                <TableRow key={i} className="border-zinc-800 animate-pulse">
                  <TableCell colSpan={6} className="h-16 bg-zinc-900/50" />
                </TableRow>
              ))
            ) : filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <TableRow key={company.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 overflow-hidden shrink-0">
                        <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" />
                      </div>
                      <span className="font-bold text-white">{company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400 font-medium">{company.role_name}</TableCell>
                  <TableCell className="text-blue-400 font-black">{company.package_amount}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-zinc-800 text-zinc-500 text-[10px] px-1.5 py-0 uppercase tracking-widest">
                      CGPA {company.eligibility_cgpa}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "border-none text-[10px] font-black uppercase tracking-widest px-2 py-0",
                      company.status === 'open' ? "bg-emerald-500/10 text-emerald-500" : 
                      company.status === 'upcoming' ? "bg-blue-500/10 text-blue-500" : 
                      "bg-zinc-800 text-zinc-500"
                    )}>
                      {company.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600 hover:text-white">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white w-40">
                        <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                          <Edit className="w-4 h-4 mr-2" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                          <ExternalLink className="w-4 h-4 mr-2" /> View Public
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-500 hover:bg-red-500/10 cursor-pointer"
                          onClick={() => handleDelete(company.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-none">
                <TableCell colSpan={6} className="h-40 text-center text-zinc-500 font-medium">
                  No companies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
