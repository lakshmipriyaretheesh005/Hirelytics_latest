'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GraduationCap, Loader2, Save, User, BookOpen, Star, Mail, Hash, Briefcase, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  rollNumber: z.string().min(5, 'Invalid roll number'),
  branch: z.string().min(1, 'Please select your branch'),
  cgpa: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 10, {
    message: 'CGPA must be between 0 and 10',
  }),
  backlogs: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: 'Backlogs must be a positive number',
  }),
  gradYear: z.string().min(4, 'Invalid graduation year'),
  skills: z.string().optional(),
})

const branches = [
  "Computer Science & Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Other"
]

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      rollNumber: '',
      branch: '',
      cgpa: '',
      backlogs: '0',
      gradYear: new Date().getFullYear().toString(),
      skills: '',
    },
  })

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        toast.error('Failed to load profile')
        return
      }

      if (profile) {
        form.reset({
          fullName: profile.full_name || '',
          rollNumber: profile.roll_number || '',
          branch: profile.branch || '',
          cgpa: profile.cgpa?.toString() || '',
          backlogs: profile.backlogs?.toString() || '0',
          gradYear: profile.grad_year?.toString() || new Date().getFullYear().toString(),
          skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : (typeof profile.skills === 'string' ? JSON.parse(profile.skills).join(', ') : ''),
        })
      }
      setIsFetching(false)
    }
    loadProfile()
  }, [])

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true)
    try {
      const skillsArray = values.skills ? values.skills.split(',').map(s => s.trim()).filter(s => s) : []

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          roll_number: values.rollNumber,
          branch: values.branch,
          cgpa: parseFloat(values.cgpa),
          backlogs: parseInt(values.backlogs),
          grad_year: parseInt(values.gradYear),
          skills: skillsArray,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-zinc-400 text-lg">Manage your personal and academic information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-700" />
            <CardContent className="pt-0 -mt-12 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-zinc-900 ring-4 ring-zinc-900/50">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-zinc-800 text-3xl font-bold text-white">
                  {form.getValues('fullName')?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4">
                <h2 className="text-xl font-bold text-white">{form.getValues('fullName')}</h2>
                <p className="text-zinc-400 text-sm flex items-center justify-center gap-1 mt-1">
                  <Mail className="w-3 h-3" /> {user?.email}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase">
                    Student
                  </span>
                  <span className="px-3 py-1 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold rounded-full">
                    {form.getValues('rollNumber')}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-zinc-800 py-4 grid grid-cols-2 gap-4">
              <div className="text-center border-r border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-tighter">CGPA</p>
                <p className="text-lg font-black text-white">{form.getValues('cgpa') || '0.00'}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-tighter">Backlogs</p>
                <p className="text-lg font-black text-white">{form.getValues('backlogs') || '0'}</p>
              </div>
            </CardFooter>
          </Card>

          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-white uppercase tracking-wider">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Application Success Rate</span>
                <span className="text-white font-bold text-green-500">75%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Mock Test Average</span>
                <span className="text-white font-bold">82%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">Profile Completion</span>
                <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 w-[95%]" />
                    </div>
                    <span className="text-white font-bold">95%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">Edit Profile Information</CardTitle>
              <CardDescription className="text-zinc-400">Update your details to stay relevant for placement opportunities.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Full Name</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                              <Input className="pl-10 bg-zinc-950/50 border-zinc-800 focus:ring-blue-500/50" placeholder="John Doe" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="rollNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">College Roll Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <Hash className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                <Input className="pl-10 bg-zinc-950/50 border-zinc-800 focus:ring-blue-500/50" placeholder="0101CS221XXX" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Department / Branch</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-zinc-950/50 border-zinc-800 focus:ring-blue-500/50">
                                <SelectValue placeholder="Select your branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-zinc-900 border-zinc-800">
                              {branches.map(b => (
                                <SelectItem key={b} value={b}>{b}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gradYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Graduation Year</FormLabel>
                          <FormControl>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                <Input className="pl-10 bg-zinc-950/50 border-zinc-800 focus:ring-blue-500/50" placeholder="2026" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cgpa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Current CGPA</FormLabel>
                          <FormControl>
                            <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-blue-500/50" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="backlogs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">Active Backlogs</FormLabel>
                          <FormControl>
                            <Input className="bg-zinc-950/50 border-zinc-800 focus:ring-blue-500/50" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-zinc-300">Skills (Comma separated)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Star className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                            <Input className="pl-10 bg-zinc-950/50 border-zinc-800 focus:ring-blue-500/50" placeholder="React, Node.js, Python, Java..." {...field} />
                          </div>
                        </FormControl>
                        <FormDescription className="text-zinc-500">These skills help us recommend the right companies for you.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end pt-4 border-t border-zinc-800">
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold px-8" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Profile
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
