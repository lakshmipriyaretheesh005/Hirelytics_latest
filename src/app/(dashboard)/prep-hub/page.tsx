'use client'

import { useState } from 'react'
import { 
  BookOpen, 
  Search, 
  HelpCircle, 
  FileText, 
  PlayCircle, 
  GraduationCap, 
  CheckCircle2, 
  TrendingUp,
  Download,
  ChevronRight,
  ExternalLink,
  Zap,
  Briefcase
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function PrepHubPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'aptitude' | 'coding' | 'interview'>('all')

  const prepKits = [
    { id: 1, title: "Quantitative Aptitude Mastery", category: "aptitude", count: "42 Topics", progress: 65, color: "bg-amber-500" },
    { id: 2, title: "Data Structures & Algorithms", category: "coding", count: "120 Problems", progress: 32, color: "bg-blue-600" },
    { id: 3, title: "HR Interview Guide", category: "interview", count: "50+ Q&A", progress: 90, color: "bg-emerald-500" },
    { id: 4, title: "System Design for Beginners", category: "coding", count: "15 Chapters", progress: 10, color: "bg-purple-600" },
    { id: 5, title: "Logical Reasoning Practice", category: "aptitude", count: "25 Sets", progress: 45, color: "bg-amber-400" },
    { id: 6, title: "Verbal Ability & Grammar", category: "aptitude", count: "30 Modules", progress: 20, color: "bg-orange-500" },
    { id: 7, title: "Database Management (SQL)", category: "coding", count: "40 Queries", progress: 55, color: "bg-sky-500" },
    { id: 8, title: "Operating Systems Revision", category: "interview", count: "20 Concepts", progress: 75, color: "bg-indigo-500" },
  ]

  const filteredKits = prepKits.filter(kit => activeCategory === 'all' || kit.category === activeCategory)

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Preparation Hub</h1>
          <p className="text-zinc-500 font-medium">Curated resources to sharpen your technical and soft skills.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto w-full md:w-auto">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-9 font-black px-4 text-xs uppercase tracking-widest", activeCategory === 'all' ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white")}
            onClick={() => setActiveCategory('all')}
          >
            All
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-9 font-black px-4 text-xs uppercase tracking-widest", activeCategory === 'aptitude' ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white")}
            onClick={() => setActiveCategory('aptitude')}
          >
            Aptitude
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-9 font-black px-4 text-xs uppercase tracking-widest", activeCategory === 'coding' ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white")}
            onClick={() => setActiveCategory('coding')}
          >
            Coding
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-9 font-black px-4 text-xs uppercase tracking-widest", activeCategory === 'interview' ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white")}
            onClick={() => setActiveCategory('interview')}
          >
            Interview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredKits.map((kit) => (
            <motion.div
              key={kit.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Card className="bg-zinc-900 border-zinc-800 hover:border-blue-500/30 transition-all group overflow-hidden shadow-xl cursor-pointer">
                <CardHeader className="relative overflow-hidden p-0 h-2 bg-zinc-800">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${kit.progress}%` }}
                    className={cn("h-full", kit.color)}
                  />
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xl", kit.color)}>
                      {kit.category === 'aptitude' && <HelpCircle className="w-5 h-5" />}
                      {kit.category === 'coding' && <FileText className="w-5 h-5" />}
                      {kit.category === 'interview' && <GraduationCap className="w-5 h-5" />}
                    </div>
                    <Badge className="bg-zinc-800 text-zinc-500 border-none text-[8px] uppercase font-black px-2 py-0">{kit.category}</Badge>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-blue-500 transition-colors leading-tight">{kit.title}</h3>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2">{kit.count}</p>
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      <span>Progress</span>
                      <span>{kit.progress}%</span>
                    </div>
                    <Progress value={kit.progress} className="h-1 bg-zinc-950" indicatorClassName={kit.color} />
                  </div>
                  <Button variant="ghost" size="sm" className="w-full text-zinc-500 hover:text-white hover:bg-zinc-800 h-8 text-[10px] font-black uppercase tracking-widest transition-all">
                    Access Material <ChevronRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-all" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Recommended Tracks */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            Recommended Tracks
          </h2>
          <div className="space-y-4">
            <TrackCard 
              title="FAANG Ready DSA Track" 
              desc="Comprehensive curriculum designed for top-tier tech companies. Includes 450+ questions."
              duration="6 Months"
              level="Advanced"
            />
            <TrackCard 
              title="MITS Core CS Revision" 
              desc="Revise OS, DBMS, and CN fundamentals for technical rounds in 15 days."
              duration="15 Days"
              level="Intermediate"
            />
            <TrackCard 
              title="Aptitude Foundation" 
              desc="Master the basics of quant and reasoning for mass recruitment drives like TCS, Infosys."
              duration="30 Days"
              level="Beginner"
            />
          </div>
        </div>

        {/* Downloads & Extras */}
        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
            <CardHeader className="bg-blue-600/5">
              <CardTitle className="text-lg font-bold">Essential Downloads</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-zinc-800">
              <DownloadItem title="MITS Official Placement Guide" size="4.2 MB" />
              <DownloadItem title="TCS Ninja Sample Questions" size="1.8 MB" />
              <DownloadItem title="Amazon SDE Interview Kit" size="12.5 MB" />
              <DownloadItem title="Technical Q&A Handout" size="840 KB" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-black text-sm">Skills Tracker</h4>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Update your progress</p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-medium">
              Keep your skill ratings up to date to get better company recommendations from our AI engine.
            </p>
            <Button variant="outline" className="w-full border-zinc-800 text-zinc-300 h-9 font-bold text-xs">Update My Skills</Button>
          </Card>
        </div>
      </div>
    </div>
  )
}

function TrackCard({ title, desc, duration, level }: any) {
  return (
    <Card className="bg-zinc-950/50 border-zinc-800 hover:border-blue-500/30 transition-all p-6 group cursor-pointer shadow-lg overflow-hidden relative">
      <div className="flex flex-col md:row items-center justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <h3 className="text-lg font-black text-white group-hover:text-blue-500 transition-colors">{title}</h3>
          <p className="text-zinc-500 text-sm font-medium leading-relaxed max-w-lg">{desc}</p>
        </div>
        <div className="flex items-center gap-6 shrink-0">
          <div className="text-center">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Duration</p>
            <p className="text-sm font-black text-white">{duration}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">Level</p>
            <p className="text-sm font-black text-blue-500">{level}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-700 group-hover:text-white group-hover:bg-blue-600 transition-all">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -z-10" />
    </Card>
  )
}

function DownloadItem({ title, size }: any) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-zinc-800/30 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-600 group-hover:text-blue-500 group-hover:bg-blue-500/5 transition-all">
          <Download className="w-4 h-4" />
        </div>
        <div>
          <p className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{title}</p>
          <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{size}</p>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-zinc-800 group-hover:text-zinc-500 transition-colors" />
    </div>
  )
}
