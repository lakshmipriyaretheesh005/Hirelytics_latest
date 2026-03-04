'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Settings, ArrowLeft, ShieldCheck, Database, Globe, Bell } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Settings className="text-blue-500" />
          Platform Settings
        </h1>
        <p className="text-zinc-400 text-lg">Configure global platform behavior and administrative controls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-zinc-900/30 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-tighter">
              <ShieldCheck className="w-5 h-5 text-blue-500" /> Security Controls
            </CardTitle>
            <CardDescription className="text-zinc-500">Manage user access and authentication rules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-white uppercase tracking-tighter">Public Registration</Label>
                <p className="text-xs text-zinc-500">Allow anyone to create an account.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-white uppercase tracking-tighter">Coordinator Access</Label>
                <p className="text-xs text-zinc-500">Allow students to be promoted to coordinator roles.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-tighter">
              <Database className="w-5 h-5 text-blue-500" /> Data Management
            </CardTitle>
            <CardDescription className="text-zinc-500">Configure database and resource behaviors.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-white uppercase tracking-tighter">Automatic Backups</Label>
                <p className="text-xs text-zinc-500">Sync database with offsite storage hourly.</p>
              </div>
              <Switch defaultChecked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-white uppercase tracking-tighter">Storage Quota</Label>
                <p className="text-xs text-zinc-500">Limit resource upload size for coordinators.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/30 border-zinc-800 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-tighter">
              <Globe className="w-5 h-5 text-blue-500" /> General Notifications
            </CardTitle>
            <CardDescription className="text-zinc-500">Configure how the system communicates with users.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center justify-between p-4 bg-zinc-800/20 rounded-lg border border-zinc-800">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-white uppercase tracking-tighter">Email Alerts</Label>
                <p className="text-xs text-zinc-500">Send drive updates via email.</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-zinc-800/20 rounded-lg border border-zinc-800">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-white uppercase tracking-tighter">Push Notifications</Label>
                <p className="text-xs text-zinc-500">Send alerts to student mobile devices.</p>
              </div>
              <Switch />
            </div>
          </CardContent>
          <CardFooter className="border-t border-zinc-800 py-4 flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 font-bold uppercase tracking-widest text-xs">Save Configuration</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
