'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Shield, 
  GraduationCap,
  Download,
  CheckCircle2,
  XCircle
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    async function fetchStudents() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('created_at', { ascending: false })
      
      if (!error) {
        setStudents(data)
      }
      setLoading(false)
    }
    fetchStudents()
  }, [])

  const filteredStudents = students.filter(s => 
    s.full_name?.toLowerCase().includes(search.toLowerCase()) || 
    s.email?.toLowerCase().includes(search.toLowerCase()) ||
    s.roll_number?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Student Directory</h1>
          <p className="text-zinc-500 font-medium">Manage student profiles and placement status.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 font-bold h-11 px-6">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex flex-col md:row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
            <Input 
              placeholder="Search by name, email or roll number..." 
              className="pl-10 h-10 bg-zinc-950 border-zinc-800 focus:ring-blue-500/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" className="border-zinc-800 text-zinc-400 h-10 w-full md:w-auto">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-zinc-950/50">
            <TableRow className="border-zinc-800 hover:bg-transparent">
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Student</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Branch</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">CGPA</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Status</TableHead>
              <TableHead className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [1,2,3,4,5].map(i => (
                <TableRow key={i} className="border-zinc-800 animate-pulse">
                  <TableCell colSpan={5} className="h-16 bg-zinc-900/50" />
                </TableRow>
              ))
            ) : filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-zinc-800">
                        <AvatarImage src={student.avatar_url} />
                        <AvatarFallback className="bg-zinc-800 text-zinc-500 text-[10px] font-bold">{student.full_name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-bold text-white text-sm">{student.full_name}</span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">{student.roll_number}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-400 font-medium text-xs">{student.branch}</TableCell>
                  <TableCell>
                    <span className={cn(
                      "font-black text-sm",
                      student.cgpa >= 8 ? "text-emerald-500" : 
                      student.cgpa >= 6 ? "text-amber-500" : "text-red-500"
                    )}>{student.cgpa}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(
                      "border-none text-[10px] font-black uppercase tracking-widest px-2 py-0",
                      student.onboarding_completed ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                    )}>
                      {student.onboarding_completed ? 'Active' : 'Pending Onboarding'}
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
                          <Mail className="w-4 h-4 mr-2" /> Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-zinc-800 cursor-pointer">
                          <Shield className="w-4 h-4 mr-2" /> Make Coordinator
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="border-none">
                <TableCell colSpan={5} className="h-40 text-center text-zinc-500 font-medium">
                  No students found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
