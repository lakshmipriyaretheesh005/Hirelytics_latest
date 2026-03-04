'use client'

import { useState } from 'react'
import { 
  Trophy, 
  Clock, 
  Award, 
  ChevronRight, 
  PlayCircle, 
  HelpCircle, 
  Search,
  Zap,
  CheckCircle2,
  TrendingUp,
  Briefcase
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function MockTestsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'company' | 'aptitude' | 'coding'>('all')

  const tests = [
    { id: 1, title: "TCS Ninja / Digital Full Mock", company: "TCS", type: "Full", duration: "90 min", questions: 60, difficulty: "Medium", completed: true, score: 82 },
    { id: 2, title: "Amazon SDE Mock Assessment", company: "Amazon", type: "Coding", duration: "120 min", questions: 3, difficulty: "Hard", completed: false, score: null },
    { id: 3, title: "Infosys Certification Mock", company: "Infosys", type: "Full", duration: "180 min", questions: 80, difficulty: "Medium", completed: false, score: null },
    { id: 4, title: "Quantitative Aptitude Mastery", company: "All", type: "Aptitude", duration: "45 min", questions: 30, difficulty: "Medium", completed: true, score: 95 },
    { id: 5, title: "Google Cloud Engineering Mock", company: "Google", type: "Technical", duration: "60 min", questions: 40, difficulty: "Hard", completed: false, score: null },
    { id: 6, title: "Logical Reasoning Practice", company: "All", type: "Aptitude", duration: "30 min", questions: 25, difficulty: "Easy", completed: false, score: null },
  ]

  const filteredTests = tests.filter(test => {
    if (activeTab === 'all') return true
    if (activeTab === 'company') return test.company !== 'All'
    if (activeTab === 'aptitude') return test.type === 'Aptitude'
    if (activeTab === 'coding') return test.type === 'Coding'
    return true
  })

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Mock Test System</h1>
          <p className="text-zinc-500 font-medium">Industry-standard simulations to test your readiness.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-9 font-bold px-4", activeTab === 'all' ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white")}
            onClick={() => setActiveTab('all')}
          >
            All Tests
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-9 font-bold px-4", activeTab === 'company' ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white")}
            onClick={() => setActiveTab('company')}
          >
            Company Specific
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-9 font-bold px-4", activeTab === 'aptitude' ? "bg-blue-600 text-white" : "text-zinc-500 hover:text-white")}
            onClick={() => setActiveTab('aptitude')}
          >
            Aptitude
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Test List */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredTests.map((test) => (
              <motion.div
                key={test.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-zinc-900 border-zinc-800 hover:border-blue-500/30 transition-all group overflow-hidden shadow-xl">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:row items-stretch">
                      <div className="p-6 flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-blue-600/10 text-blue-500 border-none px-2 py-0 text-[10px] uppercase font-black tracking-widest">{test.company}</Badge>
                            <Badge variant="outline" className="border-zinc-800 text-zinc-500 px-2 py-0 text-[10px] uppercase font-black tracking-widest">{test.type}</Badge>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-500 font-bold text-xs">
                            <Clock className="w-3.5 h-3.5" />
                            {test.duration}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-white group-hover:text-blue-500 transition-colors">{test.title}</h3>
                          <p className="text-zinc-500 text-sm font-medium mt-1">{test.questions} Multiple Choice Questions • Industry Verified</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest">
                          <span className={cn(
                            test.difficulty === 'Hard' ? "text-red-500" : 
                            test.difficulty === 'Medium' ? "text-amber-500" : "text-emerald-500"
                          )}>{test.difficulty}</span>
                          <span className="text-zinc-700">•</span>
                          <span className="text-zinc-500">14k Students taken</span>
                        </div>
                      </div>
                      <div className="w-full md:w-48 bg-zinc-950/50 border-l border-zinc-800 p-6 flex flex-col items-center justify-center gap-4 text-center">
                        {test.completed ? (
                          <div className="space-y-2">
                            <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Your Score</p>
                            <p className="text-3xl font-black text-emerald-500">{test.score}%</p>
                            <Button variant="outline" className="h-8 text-[10px] font-black uppercase tracking-widest border-zinc-800 w-full hover:bg-zinc-900">Retake</Button>
                          </div>
                        ) : (
                          <div className="space-y-4 w-full">
                            <div className="w-12 h-12 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto text-blue-500">
                              <PlayCircle className="w-6 h-6" />
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 font-black h-9 text-xs uppercase tracking-widest">Start Test</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-lg font-black text-white">Your Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-zinc-800" />
                    <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 60} strokeDashoffset={2 * Math.PI * 60 * (1 - 0.72)} strokeLinecap="round" className="text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="text-3xl font-black text-white">72</span>
                    <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Global Rank</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-black">Elite Performance</h4>
                  <p className="text-zinc-500 text-xs font-medium">You are in the top 5% of MITSians.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <span>Aptitude Average</span>
                    <span>88%</span>
                  </div>
                  <Progress value={88} className="h-1 bg-zinc-800" indicatorClassName="bg-emerald-500" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <span>Coding Mastery</span>
                    <span>42%</span>
                  </div>
                  <Progress value={42} className="h-1 bg-zinc-800" indicatorClassName="bg-blue-600" />
                </div>
              </div>
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -z-10" />
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Upcoming Contests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ContestItem title="Weekly Coding Challenge" date="Mar 05, 08:00 PM" prize="₹5,000" />
              <ContestItem title="Monthly Aptitude League" date="Mar 12, 10:00 AM" prize="Hirelytics Pro" />
              <ContestItem title="MITS Internal Hackathon" date="Mar 20, 09:00 AM" prize="Internships" />
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-zinc-800 shadow-xl overflow-hidden group p-1">
            <div className="p-6 space-y-4 bg-zinc-900 rounded-xl group-hover:bg-zinc-800 transition-colors border border-zinc-800">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Trophy className="w-6 h-6" />
              </div>
              <h4 className="text-white font-black text-lg">Earn Badges!</h4>
              <p className="text-zinc-500 text-xs font-medium leading-relaxed">
                Complete 10 mocks with 80%+ score to earn the "Placement Ready" badge on your profile.
              </p>
              <Button variant="outline" className="w-full border-zinc-700 text-zinc-400 group-hover:text-white group-hover:bg-zinc-900 h-9 font-black text-xs uppercase tracking-widest">View Leaderboard</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function ContestItem({ title, date, prize }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 group hover:bg-zinc-800 transition-colors cursor-pointer">
      <div className="space-y-1">
        <p className="text-xs font-black text-white group-hover:text-blue-500 transition-colors">{title}</p>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{date}</p>
      </div>
      <Badge className="bg-blue-600/10 text-blue-500 border-none text-[8px] uppercase font-black px-1.5 py-0">{prize}</Badge>
    </div>
  )
}
