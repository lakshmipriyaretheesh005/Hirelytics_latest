'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  Building2, 
  TrendingUp, 
  Award, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Briefcase,
  Star,
  ChevronRight,
  FileText,
  BookOpen,
  Search
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profile)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="space-y-4 animate-pulse">
      <div className="h-32 bg-zinc-900 rounded-xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-40 bg-zinc-900 rounded-xl" />
        <div className="h-40 bg-zinc-900 rounded-xl" />
        <div className="h-40 bg-zinc-900 rounded-xl" />
      </div>
    </div>
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-2xl"
      >
        <div className="relative z-10 flex flex-col md:row items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Welcome back, {profile?.full_name?.split(' ')[0]}!</h1>
            <p className="text-blue-100 max-w-lg font-medium">Your placement journey is 64% complete. Keep pushing, you're doing great!</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-3 py-1">
                CGPA: {profile?.cgpa || '0.0'}
              </Badge>
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md px-3 py-1">
                Branch: {profile?.branch || 'N/A'}
              </Badge>
              <Badge className="bg-amber-500/80 hover:bg-amber-500 text-white border-none px-3 py-1">
                Upcoming: TCS (March 15)
              </Badge>
            </div>
          </div>
          <div className="flex gap-4">
            <Link href="/companies">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-6">Explore Companies</Button>
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Building2 className="text-blue-500" />}
          title="Eligible Companies"
          value="42"
          description="Matching your profile"
          trend="+5 new this week"
        />
        <StatCard 
          icon={<TrendingUp className="text-emerald-500" />}
          title="Prob. Score"
          value="84%"
          description="Overall readiness"
          trend="Good chances"
        />
        <StatCard 
          icon={<Award className="text-amber-500" />}
          title="Applied"
          value="12"
          description="Drives participated"
          trend="3 pending results"
        />
        <StatCard 
          icon={<Star className="text-purple-500" />}
          title="Skills Match"
          value="78%"
          description="Average skill fit"
          trend="Improve Coding"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 overflow-hidden shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl font-bold">Recommended for You</CardTitle>
                <CardDescription className="text-zinc-500">Based on your skills and CGPA</CardDescription>
              </div>
              <Link href="/companies">
                <Button variant="ghost" size="sm" className="text-blue-500 hover:text-blue-400 hover:bg-blue-500/5">
                  View All <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-800">
                <CompanyRow 
                  name="Amazon" 
                  role="Software Development Engineer" 
                  package="44 LPA" 
                  logo="A" 
                  color="bg-amber-500"
                  status="Open"
                />
                <CompanyRow 
                  name="Google" 
                  role="Cloud Engineer Intern" 
                  package="1.2L PM" 
                  logo="G" 
                  color="bg-blue-500"
                  status="Deadline: Mar 10"
                />
                <CompanyRow 
                  name="Microsoft" 
                  role="Support Engineer" 
                  package="18 LPA" 
                  logo="M" 
                  color="bg-sky-500"
                  status="Eligible"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-zinc-500" />
                  Upcoming Drives
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TimelineItem 
                  title="TCS Ninja Drive" 
                  date="Mar 15, 2026" 
                  location="Main Block"
                  type="Aptitude"
                />
                <TimelineItem 
                  title="Infosys Certification" 
                  date="Mar 22, 2026" 
                  location="Online"
                  type="Coding"
                />
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  Preparation Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <span>Aptitude</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2 bg-zinc-800" indicatorClassName="bg-emerald-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <span>Coding (DSA)</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2 bg-zinc-800" indicatorClassName="bg-blue-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                    <span>Interview Prep</span>
                    <span>60%</span>
                  </div>
                  <Progress value={60} className="h-2 bg-zinc-800" indicatorClassName="bg-amber-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl relative overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-black text-white">AI Career Insight</CardTitle>
              <CardDescription className="text-zinc-500">Personalized for your profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                  <AlertCircle className="w-4 h-4" />
                  Priority Action
                </div>
                <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                  Your "Dynamic Programming" score is low. Amazon often asks these questions. Focus on this for 3 days.
                </p>
                <Button size="sm" variant="outline" className="w-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                  Start Prep Kit
                </Button>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  Resume Feedback
                </div>
                <p className="text-sm text-zinc-300 font-medium leading-relaxed">
                  Your ATS score is 82/100. Adding "Docker" or "AWS" could bump it to 90+.
                </p>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10" />
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3">
              <QuickLink href="/resume" icon={<FileText className="w-4 h-4 text-blue-500" />} title="Update Resume" />
              <QuickLink href="/prep-hub" icon={<BookOpen className="w-4 h-4 text-emerald-500" />} title="Study Material" />
              <QuickLink href="/mock-tests" icon={<TrendingUp className="w-4 h-4 text-amber-500" />} title="Take a Test" />
              <QuickLink href="/companies" icon={<Search className="w-4 h-4 text-purple-500" />} title="Search Jobs" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, title, value, description, trend }: any) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg group hover:border-blue-500/30 transition-all">
      <CardContent className="p-6 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 rounded-lg bg-zinc-800 border border-zinc-700 group-hover:bg-zinc-950 transition-colors">
            {icon}
          </div>
          <span className="text-xs font-bold text-emerald-500">{trend}</span>
        </div>
        <p className="text-3xl font-black text-white">{value}</p>
        <div>
          <p className="text-sm font-bold text-zinc-300">{title}</p>
          <p className="text-xs text-zinc-500 font-medium">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function CompanyRow({ name, role, package: pkg, logo, color, status }: any) {
  return (
    <div className="p-4 flex items-center justify-between group hover:bg-zinc-800/30 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-lg", color)}>
          {logo}
        </div>
        <div>
          <p className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors">{name}</p>
          <p className="text-xs text-zinc-500 font-medium">{role} • {pkg}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="outline" className="bg-zinc-950/50 border-zinc-700 text-zinc-400 text-[10px] px-2 py-0">
          {status}
        </Badge>
        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-all" />
      </div>
    </div>
  )
}

function TimelineItem({ title, date, location, type }: any) {
  return (
    <div className="flex gap-4 items-start group">
      <div className="relative pt-1">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-zinc-900 relative z-10" />
        <div className="absolute top-1 left-[4px] bottom-0 w-[2px] bg-zinc-800 group-last:hidden" />
      </div>
      <div className="flex-1 pb-6 group-last:pb-0">
        <div className="flex justify-between items-start mb-1">
          <p className="font-bold text-sm text-white">{title}</p>
          <Badge className="bg-zinc-800 text-zinc-400 text-[10px] px-1.5 py-0 border-none">{type}</Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {date}</span>
          <span>•</span>
          <span>{location}</span>
        </div>
      </div>
    </div>
  )
}

function QuickLink({ href, icon, title }: any) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/50 hover:bg-zinc-800 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:bg-zinc-950 transition-colors">
          {icon}
        </div>
        <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">{title}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
    </Link>
  )
}
