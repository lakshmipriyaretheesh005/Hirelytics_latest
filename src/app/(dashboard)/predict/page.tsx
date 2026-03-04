'use client'

import { useState } from 'react'
import { 
  TrendingUp, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Star, 
  Search,
  Briefcase,
  Trophy,
  ArrowRight,
  BrainCircuit,
  PieChart,
  Target
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function PlacementProbabilityPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const startAnalysis = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setResult({
        probability: 84,
        status: "High Probability",
        color: "text-emerald-500",
        suggestions: [
          "Improve Dynamic Programming skills",
          "Add Docker to your resume",
          "Practice 2 more mock interviews"
        ],
        targetCompanies: ["Amazon", "TCS Digital", "Microsoft"]
      })
      setIsAnalyzing(false)
      toast.success('AI Analysis complete!')
    }, 3000)
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Placement Predictor</h1>
          <p className="text-zinc-500 font-medium tracking-tight">AI-driven insights into your job readiness.</p>
        </div>
        <Button 
          onClick={startAnalysis} 
          disabled={isAnalyzing}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
        >
          {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
          {isAnalyzing ? "Analyzing Profile..." : "Run AI Analysis"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Result Section */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {!result && !isAnalyzing ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[500px] border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center space-y-6 bg-zinc-900/20"
              >
                <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center">
                  <Target className="w-10 h-10 text-zinc-600" />
                </div>
                <div className="text-center space-y-2 max-w-sm">
                  <h3 className="text-white font-black text-xl tracking-tight">Ready to see your future?</h3>
                  <p className="text-zinc-500 font-medium">Our AI model analyzes your CGPA, skills, and mock test history to predict your placement success rate.</p>
                </div>
                <Button onClick={startAnalysis} variant="outline" className="border-zinc-800 text-zinc-400 font-bold h-10">Start Analysis</Button>
              </motion.div>
            ) : isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[500px] bg-zinc-900 border border-zinc-800 rounded-3xl flex flex-col items-center justify-center space-y-8 shadow-2xl overflow-hidden relative"
              >
                <div className="relative">
                  <div className="w-32 h-32 rounded-full border-4 border-zinc-800 border-t-blue-600 animate-spin" />
                  <BrainCircuit className="w-10 h-10 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center space-y-3 z-10">
                  <h3 className="text-white font-black text-2xl tracking-tight">AI Engine Processing...</h3>
                  <div className="flex flex-col gap-1 items-center">
                    <p className="text-zinc-500 text-sm font-medium animate-pulse">Aggregating historical MITS data...</p>
                    <p className="text-zinc-500 text-sm font-medium animate-pulse delay-75">Calculating skill-market fit...</p>
                    <p className="text-zinc-500 text-sm font-medium animate-pulse delay-150">Simulating interview outcomes...</p>
                  </div>
                </div>
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                  {Array.from({length: 20}).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: Math.random() * 100 + "%", y: "100%" }}
                      animate={{ opacity: [0, 1, 0], y: "-10%" }}
                      transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                      className="absolute w-[1px] h-10 bg-blue-500"
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <Card className="bg-zinc-900 border-zinc-800 shadow-2xl overflow-hidden relative">
                  <CardHeader className="flex flex-row items-center justify-between pb-10">
                    <div>
                      <CardTitle className="text-2xl font-black text-white">Your Placement Score</CardTitle>
                      <CardDescription className="text-zinc-500 font-medium">Updated 2 minutes ago</CardDescription>
                    </div>
                    <Badge className="bg-blue-600 text-white font-black px-3 py-1 uppercase tracking-widest border-none">AI Verified</Badge>
                  </CardHeader>
                  <CardContent className="space-y-12 pb-10">
                    <div className="flex flex-col md:row items-center gap-12">
                      <div className="relative w-56 h-56 shrink-0">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                          <motion.circle 
                            cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 100}
                            initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - result.probability / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                            className="text-blue-500 drop-shadow-[0_0_15px_rgba(37,99,235,0.6)]"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                          <span className="text-6xl font-black text-white">{result.probability}%</span>
                          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">Ready</p>
                        </div>
                      </div>
                      <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="space-y-2">
                          <h3 className={cn("text-3xl font-black", result.color)}>{result.status}</h3>
                          <p className="text-zinc-400 font-medium leading-relaxed">
                            Based on your current performance, you are in a strong position for top-tier companies. Your high CGPA and Aptitude scores are major assets.
                          </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <ScoreCard title="Market Fit" value="Strong" color="text-emerald-500" />
                          <ScoreCard title="Confidence" value="High" color="text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -z-10" />
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-amber-500" />
                        Improvement Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.suggestions.map((s: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 group hover:border-blue-500/30 transition-all">
                          <div className="w-6 h-6 rounded bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-600/20 text-blue-500 text-xs font-black">
                            {i+1}
                          </div>
                          <p className="text-zinc-300 font-medium text-sm">{s}</p>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" className="w-full text-blue-500 hover:text-white font-bold text-xs uppercase tracking-widest">Generate Custom Prep Kit <ArrowRight className="ml-2 w-4 h-4" /></Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                    <CardHeader>
                      <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-purple-500" />
                        Target Matching
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {result.targetCompanies.map((c: string, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 group hover:bg-purple-500/10 transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 font-black text-zinc-900 text-xs">
                              {c[0]}
                            </div>
                            <span className="text-white font-bold">{c}</span>
                          </div>
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] uppercase tracking-widest">92% Match</Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-black text-white">Analysis Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <AnalysisMetric title="Academic History" score={92} />
              <AnalysisMetric title="Skill Relevance" score={78} />
              <AnalysisMetric title="Mock Performance" score={84} />
              <AnalysisMetric title="Consistency" score={95} />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 border-none shadow-2xl relative overflow-hidden p-6 group">
            <div className="relative z-10 space-y-4">
              <h4 className="text-white font-black text-xl">Level Up?</h4>
              <p className="text-blue-100 font-medium leading-relaxed text-sm">
                Our premium coaching sessions have a 95% success rate for students with scores above 80%.
              </p>
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black h-11">
                Explore Pro Track
              </Button>
            </div>
            <TrendingUp className="absolute -bottom-6 -right-6 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
          </Card>
        </div>
      </div>
    </div>
  )
}

function ScoreCard({ title, value, color }: any) {
  return (
    <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-800 space-y-1">
      <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{title}</p>
      <p className={cn("text-xl font-black", color)}>{value}</p>
    </div>
  )
}

function AnalysisMetric({ title, score }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
        <span className="text-zinc-500">{title}</span>
        <span className="text-white">{score}%</span>
      </div>
      <Progress value={score} className="h-1 bg-zinc-950" indicatorClassName="bg-blue-600" />
    </div>
  )
}
