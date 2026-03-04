'use client'

import { useState, useRef } from 'react'
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download, 
  Trash2, 
  TrendingUp, 
  Star, 
  Search,
  LayoutGrid,
  Zap,
  CheckCircle,
  XCircle,
  HelpCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ResumeEvaluatorPage() {
  const [isUploading, setIsUploading] = useState(false)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file')
        return
      }
      setFile(selectedFile)
      setIsEvaluating(true)
      
      // Simulate evaluation
      setTimeout(() => {
        setScore(84)
        setIsEvaluating(false)
        toast.success('Resume evaluation complete!')
      }, 3000)
    }
  }

  const triggerUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Resume Evaluator</h1>
          <p className="text-zinc-500 font-medium tracking-tight">Get AI-driven feedback to beat the ATS bots.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900/50 text-zinc-400 font-bold h-11 px-6">
            <LayoutGrid className="w-4 h-4 mr-2" /> Templates
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-8 shadow-[0_0_20px_rgba(37,99,235,0.3)]" onClick={triggerUpload}>
            <Upload className="w-4 h-4 mr-2" /> {file ? "Update Resume" : "Upload Resume"}
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept=".pdf"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Evaluator Section */}
        <div className="lg:col-span-2 space-y-8">
          {!file && !isEvaluating ? (
            <div 
              className="h-[400px] border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center space-y-4 bg-zinc-900/20 hover:bg-zinc-900/40 transition-all cursor-pointer group"
              onClick={triggerUpload}
            >
              <div className="w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center border border-zinc-700 group-hover:bg-blue-600/10 group-hover:border-blue-600/30 transition-all">
                <FileText className="w-10 h-10 text-zinc-500 group-hover:text-blue-500 transition-colors" />
              </div>
              <div className="text-center space-y-1">
                <p className="text-white font-black text-lg tracking-tight">Drop your resume here</p>
                <p className="text-zinc-500 font-medium">Supported format: PDF only (Max 5MB)</p>
              </div>
            </div>
          ) : isEvaluating ? (
            <Card className="h-[400px] border-zinc-800 bg-zinc-900/50 backdrop-blur-xl flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-zinc-800 border-t-blue-600 animate-spin" />
                <FileText className="w-8 h-8 text-blue-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-white font-black text-xl tracking-tight">Evaluating Your Profile...</p>
                <div className="flex flex-col gap-1 items-center">
                  <p className="text-zinc-500 text-sm font-medium animate-pulse">Scanning keywords...</p>
                  <p className="text-zinc-500 text-sm font-medium animate-pulse delay-75">Checking layout compliance...</p>
                  <p className="text-zinc-500 text-sm font-medium animate-pulse delay-150">Analyzing skill match...</p>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-8">
              <Card className="bg-zinc-900 border-zinc-800 shadow-xl overflow-hidden relative">
                <CardHeader className="flex flex-row items-center justify-between pb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                      <FileText className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold">{file?.name}</CardTitle>
                      <CardDescription className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Uploaded Today • 1.2 MB</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 border-zinc-800 text-zinc-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 border-zinc-800 text-red-500 hover:bg-red-500/10" onClick={() => {setFile(null); setScore(null);}}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-12">
                  <div className="flex flex-col md:row items-center gap-12">
                    <div className="relative w-48 h-48 shrink-0">
                      <svg className="w-full h-full -rotate-90">
                        <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
                        <motion.circle 
                          cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
                          strokeDasharray={2 * Math.PI * 88}
                          initial={{ strokeDashoffset: 2 * Math.PI * 88 }}
                          animate={{ strokeDashoffset: 2 * Math.PI * 88 * (1 - (score || 0) / 100) }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          strokeLinecap="round"
                          className="text-blue-500 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]"
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-5xl font-black text-white">{score}</span>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">ATS Score</p>
                      </div>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-none font-black text-[10px] uppercase tracking-widest px-2 py-0">Healthy</Badge>
                          <h3 className="text-xl font-black text-white">Strong Profile!</h3>
                        </div>
                        <p className="text-zinc-400 font-medium leading-relaxed">
                          Your resume is highly optimized for technical roles. It has a clear hierarchy and strong keyword presence. A few tweaks could make it perfect.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <ScoreStat title="Impact" value="88%" status="good" />
                        <ScoreStat title="Keywords" value="72%" status="neutral" />
                        <ScoreStat title="Formatting" value="95%" status="good" />
                        <ScoreStat title="Clarity" value="82%" status="good" />
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
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      What's working
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FeatureItem text="Action-oriented verbs (Designed, Led, Implemented)" />
                    <FeatureItem text="Quantifiable achievements (Increased by 20%)" />
                    <FeatureItem text="Clean single-column layout" />
                    <FeatureItem text="Contact info is easily parsable" />
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      Improvements needed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ImprovementItem text="Add more Cloud-related keywords (AWS, Azure)" />
                    <ImprovementItem text="Summary section is slightly too long" />
                    <ImprovementItem text="Include links to GitHub/Portfolio" />
                    <ImprovementItem text="Specify tools used in projects" />
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Panel */}
        <div className="space-y-8">
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-black text-white">Target Company Check</CardTitle>
              <CardDescription className="text-zinc-500">Scan against a specific role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <input 
                  placeholder="Select company..." 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  defaultValue="Amazon - SDE-1"
                />
              </div>
              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-3">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-blue-400">
                  <span>Match Rate</span>
                  <span>74%</span>
                </div>
                <Progress value={74} className="h-1.5 bg-zinc-950" indicatorClassName="bg-blue-500" />
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                  Missing keywords: <span className="text-zinc-300 font-black">GraphQL, Redis, Docker</span>. Amazon's ATS looks for these in SDE roles.
                </p>
                <Button variant="outline" className="w-full border-blue-500/20 text-blue-500 h-8 text-[10px] font-black uppercase tracking-widest">
                  View Full Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Recommended Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ResourceLink title="Standard MITS Resume Template" type="PDF" />
              <ResourceLink title="ATS Optimization Guide" type="DOC" />
              <ResourceLink title="Action Verbs for Engineers" type="PDF" />
            </CardContent>
          </Card>

          <Card className="bg-blue-600 border-none shadow-2xl relative overflow-hidden group">
            <CardHeader className="relative z-10">
              <CardTitle className="text-white font-black text-xl">Need a Mentor?</CardTitle>
              <CardDescription className="text-blue-100 font-medium">Get your resume reviewed by alumni at FAANG.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black h-11 shadow-xl">
                Book a Session
              </Button>
            </CardContent>
            <Zap className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:scale-110 transition-transform" />
          </Card>
        </div>
      </div>
    </div>
  )
}

function ScoreStat({ title, value, status }: any) {
  return (
    <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{title}</span>
        <div className={cn("w-1.5 h-1.5 rounded-full", status === 'good' ? "bg-emerald-500" : "bg-amber-500")} />
      </div>
      <p className="text-lg font-black text-white">{value}</p>
    </div>
  )
}

function FeatureItem({ text }: any) {
  return (
    <div className="flex items-center gap-3 text-zinc-400 font-medium text-sm">
      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
        <CheckCircle className="w-3 h-3 text-emerald-500" />
      </div>
      {text}
    </div>
  )
}

function ImprovementItem({ text }: any) {
  return (
    <div className="flex items-center gap-3 text-zinc-400 font-medium text-sm">
      <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20">
        <AlertCircle className="w-3 h-3 text-amber-500" />
      </div>
      {text}
    </div>
  )
}

function ResourceLink({ title, type }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-950 hover:bg-zinc-800 transition-colors group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500 border border-zinc-800">
          {type}
        </div>
        <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{title}</span>
      </div>
      <Download className="w-4 h-4 text-zinc-700 group-hover:text-blue-500" />
    </div>
  )
}
