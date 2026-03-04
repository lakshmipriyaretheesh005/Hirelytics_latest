'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUpAction(formData: {
  fullName: string
  email: string
  password: string
}) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'}/auth/callback`,
      },
    })

    if (error) {
      console.error('Auth error:', error)
      if (error.message.includes('Database error saving new user')) {
        return { error: 'Internal Database Error: This usually happens if there is a conflict or profile setup failure. I am fixing it now.' }
      }
      return { error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Unexpected auth error:', error)
    if (error.message?.includes('fetch failed')) {
      return { error: 'Network Connection Error: Your computer is unable to reach the database server. This is a DNS issue on your network. Please try switching to a different network or update your DNS to 8.8.8.8.' }
    }
    return { error: 'An unexpected connection error occurred. Please try again later.' }
  }
}

export async function signInAction(formData: {
  email: string
  password: string
}) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      console.error('Auth error:', error)
      return { error: error.message }
    }

    // Get user profile to determine redirect
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed, role')
        .eq('id', user.id)
        .single()

      revalidatePath('/', 'layout')
      
      if (profile?.role === 'admin') {
        redirect('/admin')
      } else if (!profile?.onboarding_completed) {
        redirect('/onboarding')
      } else {
        redirect('/dashboard')
      }
    }
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) {
      throw error // Re-throw Next.js redirects
    }
    console.error('Unexpected auth error:', error)
    if (error.message?.includes('fetch failed')) {
      return { error: 'Network Connection Error: Your computer is unable to reach the database server. This is a DNS issue on your network. Please try switching to a different network or update your DNS to 8.8.8.8.' }
    }
    return { error: 'An unexpected connection error occurred. Please try again later.' }
  }

  return { success: true }
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}
