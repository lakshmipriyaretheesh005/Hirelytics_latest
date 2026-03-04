'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Hammer, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminResourcesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20">
        <Hammer className="w-10 h-10 text-blue-500 animate-bounce" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white uppercase tracking-widest">Resources Module</h1>
        <p className="text-zinc-400 max-w-md mx-auto">
          The central resource management system is currently under heavy development. 
          Soon you will be able to manage PDFs, video guides, and prep kits here.
        </p>
      </div>

      <div className="flex gap-4">
        <Button asChild variant="outline" className="border-zinc-800">
          <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Request Early Access
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-12">
        <Card className="bg-zinc-900/30 border-zinc-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-tighter">Content Delivery</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-zinc-500">Fast, secure delivery of academic resources to students.</p>
            </CardContent>
        </Card>
        <Card className="bg-zinc-900/30 border-zinc-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-tighter">Usage Analytics</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-zinc-500">Track which resources are most helpful for students.</p>
            </CardContent>
        </Card>
        <Card className="bg-zinc-900/30 border-zinc-800">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-tighter">Bulk Import</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-xs text-zinc-500">Easily upload resource kits via CSV or ZIP folders.</p>
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
