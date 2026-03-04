'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
  Building2, 
  Users, 
  TrendingUp, 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Briefcase,
  BookOpen,
  Plus,
  MoreVertical,
  ChevronRight,
  Bell
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalStudents: 1240,
    totalCompanies: 42,
    placedStudents: 582,
    avgPackage: "12.5 LPA"
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // In a real app, fetch real stats from Supabase
    setLoading(false)
  }, [])

  if (loading) return null

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Admin Overview</h1>
          <p className="text-zinc-500 font-medium">Real-time placement performance and management.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 font-bold h-10">
            Export Report
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-6">
            New Drive
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          title="Total Students" 
          value={stats.totalStudents.toString()} 
          icon={<Users className="w-5 h-5 text-blue-500" />}
          trend="+12% from last month"
          trendUp={true}
        />
        <AdminStatCard 
          title="Active Companies" 
          value={stats.totalCompanies.toString()} 
          icon={<Building2 className="w-5 h-5 text-purple-500" />}
          trend="+4 new this week"
          trendUp={true}
        />
        <AdminStatCard 
          title="Students Placed" 
          value={stats.placedStudents.toString()} 
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
          trend="46.9% of batch"
          trendUp={true}
        />
        <AdminStatCard 
          title="Avg. Package" 
          value={stats.avgPackage} 
          icon={<Briefcase className="w-5 h-5 text-amber-500" />}
          trend="+₹1.2L increase"
          trendUp={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Placement Progress Chart (Simulated) */}
        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Placement Trends</CardTitle>
              <CardDescription className="text-zinc-500">Monthly hiring data for 2026</CardDescription>
            </div>
            <Badge variant="outline" className="border-zinc-800 text-zinc-400">Monthly</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-2 pt-10 px-2">
              {[40, 65, 55, 85, 45, 95, 75, 60, 80, 50, 70, 90].map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    className={cn(
                      "w-full rounded-t-sm transition-all group-hover:bg-blue-500 cursor-help relative",
                      i % 2 === 0 ? "bg-zinc-800" : "bg-blue-600/60"
                    )}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {val} hires
                    </div>
                  </motion.div>
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Branches */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Branch Statistics</CardTitle>
            <CardDescription className="text-zinc-500">Hiring by department</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <BranchStat name="CSE" placed={142} total={180} />
            <BranchStat name="IT" placed={110} total={120} />
            <BranchStat name="ECE" placed={85} total={140} />
            <BranchStat name="EE" placed={60} total={130} />
            <BranchStat name="MECH" placed={45} total={120} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold">Recent Activities</CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-500 h-8">View Logs</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <ActivityItem 
              icon={<Building2 className="w-4 h-4 text-blue-500" />}
              title="New Company Added"
              desc="NVIDIA added to recruitment drive"
              time="2 hours ago"
            />
            <ActivityItem 
              icon={<Users className="w-4 h-4 text-emerald-500" />}
              title="Batch Import Successful"
              desc="Imported 240 students for 2027 batch"
              time="5 hours ago"
            />
            <ActivityItem 
              icon={<Bell className="w-4 h-4 text-amber-500" />}
              title="Notification Sent"
              desc="TCS drive alert sent to 800 students"
              time="1 day ago"
            />
            <ActivityItem 
              icon={<Plus className="w-4 h-4 text-purple-500" />}
              title="Resource Published"
              desc="System Design Prep Kit is now live"
              time="1 day ago"
            />
          </CardContent>
        </Card>

        {/* Live Drives */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Live & Upcoming Drives</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-800">
              <DriveRow name="Amazon SDE" date="Mar 10" status="Live" applicants={420} />
              <DriveRow name="Google Cloud" date="Mar 15" status="Upcoming" applicants={210} />
              <DriveRow name="Microsoft" date="Mar 22" status="Draft" applicants={0} />
              <DriveRow name="TCS Digital" date="Mar 28" status="Live" applicants={1100} />
            </div>
          </CardContent>
          <CardFooter className="bg-zinc-950/30 p-4">
            <Button variant="ghost" className="w-full text-zinc-500 hover:text-white h-9 font-bold text-xs uppercase tracking-widest">
              Manage All Drives <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function AdminStatCard({ title, value, icon, trend, trendUp }: any) {
  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg group hover:border-blue-500/30 transition-all">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 group-hover:bg-zinc-800 transition-colors">
            {icon}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-600">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-black text-zinc-500 uppercase tracking-widest">{title}</p>
          <p className="text-3xl font-black text-white">{value}</p>
        </div>
        <div className="mt-4 flex items-center gap-1.5">
          {trendUp ? (
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5 text-red-500" />
          )}
          <span className={cn("text-xs font-bold", trendUp ? "text-emerald-500" : "text-red-500")}>{trend}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function BranchStat({ name, placed, total }: any) {
  const percentage = Math.round((placed / total) * 100)
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <div>
          <span className="text-sm font-black text-white">{name}</span>
          <span className="text-[10px] text-zinc-500 font-bold ml-2 uppercase tracking-widest">{placed}/{total} Placed</span>
        </div>
        <span className="text-xs font-black text-blue-500">{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-1.5 bg-zinc-800" indicatorClassName="bg-blue-600" />
    </div>
  )
}

function ActivityItem({ icon, title, desc, time }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-white leading-none">{title}</p>
        <p className="text-xs text-zinc-500 font-medium">{desc}</p>
        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest pt-1">{time}</p>
      </div>
    </div>
  )
}

function DriveRow({ name, date, status, applicants }: any) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-8 bg-zinc-800 rounded-full" />
        <div>
          <p className="text-sm font-bold text-white">{name}</p>
          <p className="text-xs text-zinc-500 font-medium">{date} • {applicants} Applicants</p>
        </div>
      </div>
      <Badge className={cn(
        "border-none text-[10px] font-black uppercase tracking-widest px-2 py-0",
        status === 'Live' ? "bg-emerald-500/10 text-emerald-500" : 
        status === 'Upcoming' ? "bg-blue-500/10 text-blue-500" : 
        "bg-zinc-800 text-zinc-500"
      )}>
        {status}
      </Badge>
    </div>
  )
}
