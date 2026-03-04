'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MessageSquare, ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminFeedbackPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20">
        <MessageSquare className="w-10 h-10 text-blue-500 animate-pulse" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Feedback Module</h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          Student experience and feedback system is being upgraded to support 
          anonymous reports and sentiment analysis.
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild variant="outline" className="border-zinc-800">
          <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mt-12">
        <Card className="bg-zinc-900/30 border-zinc-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                    <Star className="w-4 h-4 text-blue-500" /> Student Reports
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-zinc-500 text-left">Read and respond to feedback submitted by students about specific placement processes.</p>
            </CardContent>
        </Card>
        <Card className="bg-zinc-900/30 border-zinc-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-tighter flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-500" /> Interview Experience
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-zinc-500 text-left">Manage the database of student-contributed interview questions and experiences.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
