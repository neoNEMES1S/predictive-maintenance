import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabase !== null
}

// Storage helpers
export const storage = {
  upload: async (bucket, path, file) => {
    if (!supabase) {
      console.warn('Supabase not configured')
      return { data: null, error: 'Supabase not configured' }
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file)
    
    return { data, error }
  },
  
  download: async (bucket, path) => {
    if (!supabase) {
      console.warn('Supabase not configured')
      return { data: null, error: 'Supabase not configured' }
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    
    return { data, error }
  },
  
  getPublicUrl: (bucket, path) => {
    if (!supabase) {
      return null
    }
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  },
  
  delete: async (bucket, paths) => {
    if (!supabase) {
      return { data: null, error: 'Supabase not configured' }
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove(paths)
    
    return { data, error }
  },
}

// Auth helpers
export const auth = {
  signUp: async (email, password) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    return { data, error }
  },
  
  signIn: async (email, password) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase not configured' } }
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    return { data, error }
  },
  
  signOut: async () => {
    if (!supabase) {
      return { error: null }
    }
    
    const { error } = await supabase.auth.signOut()
    return { error }
  },
  
  getSession: async () => {
    if (!supabase) {
      return { data: { session: null }, error: null }
    }
    
    const { data, error } = await supabase.auth.getSession()
    return { data, error }
  },
  
  getUser: async () => {
    if (!supabase) {
      return { data: { user: null }, error: null }
    }
    
    const { data, error } = await supabase.auth.getUser()
    return { data, error }
  },
}

// Realtime subscription helpers
export const realtime = {
  subscribe: (table, callback) => {
    if (!supabase) {
      console.warn('Supabase not configured')
      return null
    }
    
    const channel = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: table,
      }, callback)
      .subscribe()
    
    return channel
  },
  
  unsubscribe: (channel) => {
    if (channel && supabase) {
      supabase.removeChannel(channel)
    }
  },
}

export default supabase

