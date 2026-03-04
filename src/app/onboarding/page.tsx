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
import { GraduationCap, Loader2, ArrowRight, User, BookOpen, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const onboardingSchema = z.object({
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

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const supabase = createClient()

  const form = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
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
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, full_name')
        .eq('id', user.id)
        .single()

      if (profile?.onboarding_completed) {
        router.push('/dashboard')
        return
      }

      if (profile?.full_name) {
        form.setValue('fullName', profile.full_name)
      }
      setIsCheckingAuth(false)
    }
    checkAuth()
  }, [])

  async function onSubmit(values: z.infer<typeof onboardingSchema>) {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

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
          skills: JSON.stringify(skillsArray),
          onboarding_completed: true,
        })
        .eq('id', user.id)

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Profile completed successfully!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      <div className="w-full max-w-2xl relative z-10">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <GraduationCap className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white uppercase tracking-widest">Hirelytics</span>
        </div>

        <Card className="border-zinc-800 bg-zinc-900/50 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Step {step} of 3</span>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1 w-8 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-zinc-800'}`} />
                ))}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {step === 1 && "Personal Information"}
              {step === 2 && "Academic Records"}
              {step === 3 && "Skills & Preferences"}
            </CardTitle>
            <CardDescription className="text-zinc-400">
              {step === 1 && "Tell us a bit about yourself to get started."}
              {step === 2 && "Your academic performance helps us find eligible companies."}
              {step === 3 && "Showcase your skills for better recommendations."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300">Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                <Input className="pl-10 bg-zinc-950/50 border-zinc-800" placeholder="John Doe" {...field} />
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
                              <Input className="bg-zinc-950/50 border-zinc-800" placeholder="0101CS221XXX" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="branch"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300">Department / Branch</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-zinc-950/50 border-zinc-800">
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
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="cgpa"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-300">Current CGPA</FormLabel>
                              <FormControl>
                                <Input className="bg-zinc-950/50 border-zinc-800" placeholder="0.00" {...field} />
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
                                <Input className="bg-zinc-950/50 border-zinc-800" type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="gradYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300">Graduation Year</FormLabel>
                            <FormControl>
                              <Input className="bg-zinc-950/50 border-zinc-800" placeholder="2026" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-zinc-300">Skills (Comma separated)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Star className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                                <Input className="pl-10 bg-zinc-950/50 border-zinc-800" placeholder="React, Node.js, Python, Java..." {...field} />
                              </div>
                            </FormControl>
                            <FormDescription>These skills help us recommend the right companies for you.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between pt-4">
                  {step > 1 && (
                    <Button type="button" variant="outline" className="border-zinc-800" onClick={() => setStep(step - 1)}>
                      Back
                    </Button>
                  )}
                  <div className="ml-auto">
                    {step < 3 ? (
                      <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={() => setStep(step + 1)}>
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Complete Profile"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
