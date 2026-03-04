'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { 
  Building2, 
  MapPin, 
  Bookmark, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  ArrowLeft,
  Briefcase,
  TrendingUp,
  FileText,
  PlayCircle,
  Trophy,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  GraduationCap
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function CompanyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [company, setCompany] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false)
  const [eligibilityResult, setEligibilityResult] = useState<'eligible' | 'not_eligible' | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', params.id)
        .single()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        setProfile(profileData)
      }

      if (!companyError) {
        setCompany(companyData)
      }
      setLoading(false)
    }
    fetchData()
  }, [params.id])

  const checkEligibility = () => {
    setIsCheckingEligibility(true)
    setTimeout(() => {
      if (profile && company) {
        const isEligible = 
          profile.cgpa >= company.eligibility_cgpa && 
          profile.backlogs <= (company.eligibility_backlogs || 0)
        setEligibilityResult(isEligible ? 'eligible' : 'not_eligible')
      }
      setIsCheckingEligibility(false)
    }, 1500)
  }

  if (loading) {
    return <div className="h-screen flex items-center justify-center bg-zinc-950 text-blue-500"><Clock className="w-10 h-10 animate-spin" /></div>
  }

  if (!company) {
    return <div className="p-10 text-center text-white">Company not found.</div>
  }

  return (
    <div className="space-y-8 pb-20">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-all" />
        <span className="text-sm font-bold">Back to explore</span>
      </button>

      {/* Header Section */}
      <div className="flex flex-col lg:row lg:items-end justify-between gap-8">
        <div className="flex flex-col md:row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center p-4 shadow-2xl shrink-0 overflow-hidden border border-zinc-800">
            <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-black text-white tracking-tight">{company.name}</h1>
              <Badge className={cn(
                "border-none text-xs px-2.5 py-0.5 font-black uppercase tracking-widest",
                company.status === 'open' ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
              )}>
                {company.status}
              </Badge>
            </div>
            <p className="text-xl font-bold text-zinc-400">{company.role_name}</p>
            <div className="flex flex-wrap items-center gap-4 text-zinc-500 text-sm font-medium">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {company.location}</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> {company.package_amount}</span>
              <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> 500+ Hired at MITS</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white h-11 px-6">
            <Bookmark className="w-4 h-4 mr-2" /> Bookmark
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            Apply Now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-zinc-900/50 border border-zinc-800 p-1 rounded-xl w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold px-6 py-2.5">Overview</TabsTrigger>
              <TabsTrigger value="timeline" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold px-6 py-2.5">Timeline</TabsTrigger>
              <TabsTrigger value="resources" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold px-6 py-2.5">Prep Kit</TabsTrigger>
              <TabsTrigger value="qna" className="rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white font-bold px-6 py-2.5">Previous Questions</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-8">
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">About the Role</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-zinc-400 leading-relaxed font-medium">
                  <p>{company.description || `Join ${company.name} as a ${company.role_name} and work on cutting-edge technologies that solve real-world problems at scale. We are looking for passionate engineers from MITS who can drive innovation.`}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                      <h4 className="text-white font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Eligibility Criteria
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                          <span>Minimum CGPA</span>
                          <span className="text-white font-bold">{company.eligibility_cgpa}</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                          <span>Active Backlogs Allowed</span>
                          <span className="text-white font-bold">{company.eligibility_backlogs || 0}</span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-800 pb-2">
                          <span>Branches Allowed</span>
                          <span className="text-white font-bold text-right text-xs">CS, IT, EC, EE</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-white font-bold flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-blue-500" />
                        Key Responsibilities
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Design and develop scalable software components</li>
                        <li>• Collaborate with cross-functional teams</li>
                        <li>• Maintain high-quality code and testing standards</li>
                        <li>• Participate in system architecture reviews</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Package Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                      <span className="text-sm font-medium text-zinc-500">Fixed Component</span>
                      <span className="text-white font-black">₹18,00,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-zinc-950/50 border border-zinc-800">
                      <span className="text-sm font-medium text-zinc-500">Variable / Performance</span>
                      <span className="text-white font-black">₹4,00,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-600/10 border border-blue-600/20">
                      <span className="text-sm font-bold text-blue-400">Total Compensation</span>
                      <span className="text-blue-400 font-black">{company.package_amount}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Interview Difficulty</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                        <span>Aptitude</span>
                        <span>Medium</span>
                      </div>
                      <Progress value={60} className="h-2 bg-zinc-800" indicatorClassName="bg-amber-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                        <span>Coding</span>
                        <span>Hard</span>
                      </div>
                      <Progress value={85} className="h-2 bg-zinc-800" indicatorClassName="bg-red-500" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-zinc-500">
                        <span>Technical Interview</span>
                        <span>Hard</span>
                      </div>
                      <Progress value={80} className="h-2 bg-zinc-800" indicatorClassName="bg-red-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="mt-6">
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl p-8">
                <div className="space-y-12">
                  <TimelineStep 
                    number="01" 
                    title="Online Aptitude Test" 
                    description="Logical reasoning, quantitative aptitude, and verbal ability. Usually 60-90 minutes."
                    status="completed"
                  />
                  <TimelineStep 
                    number="02" 
                    title="Coding Assessment" 
                    description="2-3 DSA problems (Medium-Hard) to be solved in 90 minutes. Platforms: HackerRank/AMCAT."
                    status="in-progress"
                  />
                  <TimelineStep 
                    number="03" 
                    title="Technical Interview 1" 
                    description="Deep dive into Core CS subjects (OS, DBMS, CN), Projects, and Live Coding."
                    status="pending"
                  />
                  <TimelineStep 
                    number="04" 
                    title="Technical Interview 2 / Managerial" 
                    description="System Design (basics), Behavioral questions, and Team-fit assessment."
                    status="pending"
                  />
                  <TimelineStep 
                    number="05" 
                    title="HR Interview" 
                    description="Final salary discussion, location preferences, and joining date confirmation."
                    status="pending"
                  />
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PrepCard 
                  title="Aptitude Mastery Kit" 
                  icon={<HelpCircle className="w-5 h-5 text-amber-500" />}
                  items={["Number Systems", "Profit & Loss", "Time & Work", "Permutations"]}
                  progress={80}
                />
                <PrepCard 
                  title="Coding Prep (DSA)" 
                  icon={<FileText className="w-5 h-5 text-blue-500" />}
                  items={["Linked Lists", "Dynamic Programming", "Trees & Graphs", "Sorting"]}
                  progress={35}
                />
                <PrepCard 
                  title="Video Lectures" 
                  icon={<PlayCircle className="w-5 h-5 text-emerald-500" />}
                  items={["System Design Basics", "Mock Interviews", "HR Tips", "OS Revision"]}
                  progress={0}
                />
                <PrepCard 
                  title="Mock Test Series" 
                  icon={<Trophy className="w-5 h-5 text-purple-500" />}
                  items={["Full Mock 1", "Full Mock 2", "Topic-wise 1", "Topic-wise 2"]}
                  progress={0}
                />
              </div>
            </TabsContent>

            <TabsContent value="qna" className="mt-6">
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
                <div className="divide-y divide-zinc-800">
                  <QuestionItem 
                    category="Coding" 
                    question="Given an array of integers, find the length of the longest strictly increasing subsequence." 
                    difficulty="Hard"
                  />
                  <QuestionItem 
                    category="DBMS" 
                    question="Explain ACID properties with real-world examples. What is the difference between TRUNCATE and DELETE?" 
                    difficulty="Medium"
                  />
                  <QuestionItem 
                    category="System Design" 
                    question="How would you design a URL shortener like Bitly? Focus on database schema and scalability." 
                    difficulty="Hard"
                  />
                  <QuestionItem 
                    category="Operating Systems" 
                    question="What is Thrashing? How do we prevent it in multi-programmed systems?" 
                    difficulty="Medium"
                  />
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden relative">
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg font-black text-white">Eligibility Checker</CardTitle>
              <CardDescription className="text-zinc-500">Instantly verify if you can apply</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Required CGPA</span>
                  <span className="text-white font-bold">{company.eligibility_cgpa}+</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-zinc-400">Your CGPA</span>
                  <span className={cn("font-bold", profile?.cgpa >= company.eligibility_cgpa ? "text-emerald-500" : "text-red-500")}>
                    {profile?.cgpa || '0.00'}
                  </span>
                </div>
              </div>

              {!eligibilityResult ? (
                <Button 
                  className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold h-11"
                  onClick={checkEligibility}
                  disabled={isCheckingEligibility}
                >
                  {isCheckingEligibility ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Eligibility"}
                </Button>
              ) : eligibilityResult === 'eligible' ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-emerald-500 font-bold">You are Eligible!</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Ready to apply</p>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-bold">Register Now</Button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center space-y-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="text-white w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-red-500 font-bold">Not Eligible</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Requirements not met</p>
                  </div>
                  <Button variant="outline" className="w-full border-zinc-800 text-zinc-400">View Other Companies</Button>
                </div>
              )}
            </CardContent>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl" />
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-black text-white">Placement Stats (MITS)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-600/20">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">142</p>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Hired last year</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-600/10 rounded-xl flex items-center justify-center border border-amber-600/20">
                  <TrendingUp className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">92%</p>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Selection Rate</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-600/10 rounded-xl flex items-center justify-center border border-emerald-600/20">
                  <GraduationCap className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">44 LPA</p>
                  <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Highest MITS Offer</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-xl p-6 space-y-4">
            <h4 className="text-sm font-black text-zinc-500 uppercase tracking-widest">Support</h4>
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="justify-between border-zinc-800 text-zinc-400 group h-10 text-xs">
                Request Mentor <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
              </Button>
              <Button variant="outline" className="justify-between border-zinc-800 text-zinc-400 group h-10 text-xs">
                Report Issue <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-all" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

function TimelineStep({ number, title, description, status }: any) {
  return (
    <div className="flex gap-6 relative">
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm z-10 border-4 border-zinc-950",
          status === 'completed' ? "bg-emerald-500 text-white" : 
          status === 'in-progress' ? "bg-blue-600 text-white animate-pulse" : 
          "bg-zinc-800 text-zinc-500"
        )}>
          {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : number}
        </div>
        <div className="w-1 h-full bg-zinc-800 absolute top-10" />
      </div>
      <div className="pb-10 space-y-2">
        <h3 className={cn("text-lg font-bold", status === 'pending' ? "text-zinc-500" : "text-white")}>{title}</h3>
        <p className="text-zinc-500 text-sm max-w-lg font-medium leading-relaxed">{description}</p>
        {status === 'in-progress' && <Badge className="bg-blue-600/10 text-blue-500 border-none px-2 py-0 text-[10px] uppercase font-black">Active</Badge>}
      </div>
    </div>
  )
}

function PrepCard({ title, icon, items, progress }: any) {
  return (
    <Card className="bg-zinc-950/50 border-zinc-800 hover:border-blue-500/30 transition-all group overflow-hidden shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 group-hover:bg-zinc-800 transition-colors">
            {icon}
          </div>
          <CardTitle className="text-base font-bold text-white">{title}</CardTitle>
        </div>
        <span className="text-xs font-black text-blue-500">{progress}%</span>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {items.map((item: string, i: number) => (
            <li key={i} className="flex items-center gap-2 text-xs font-medium text-zinc-500">
              <div className="w-1 h-1 rounded-full bg-zinc-700" />
              {item}
            </li>
          ))}
        </ul>
        <div className="space-y-3 pt-2">
          <Progress value={progress} className="h-1.5 bg-zinc-900" indicatorClassName="bg-blue-600" />
          <Button variant="ghost" size="sm" className="w-full text-zinc-500 hover:text-white hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest h-8">
            Access Resources <ExternalLink className="w-3 h-3 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function QuestionItem({ category, question, difficulty }: any) {
  return (
    <div className="p-6 space-y-3 hover:bg-zinc-800/30 transition-colors cursor-pointer group">
      <div className="flex items-center justify-between">
        <Badge className="bg-zinc-800 text-zinc-400 border-none px-2 py-0.5 text-[10px] font-black uppercase tracking-widest">
          {category}
        </Badge>
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest",
          difficulty === 'Hard' ? "text-red-500" : "text-amber-500"
        )}>{difficulty}</span>
      </div>
      <p className="text-white font-bold leading-relaxed">{question}</p>
      <div className="flex gap-4 pt-2">
        <button className="text-xs font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest">View Solution</button>
        <button className="text-xs font-black text-zinc-500 hover:text-white transition-colors uppercase tracking-widest">Practice Link</button>
      </div>
    </div>
  )
}

function Loader2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
