import { createClient } from '@supabase/supabase-js'

// Projeto: holos-v2
const SUPABASE_URL = 'https://zrcdxzadhquijqpyandu.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyY2R4emFkaHF1aWpxcHlhbmR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxOTQxMTEsImV4cCI6MjEwMDc3MDExMX0.HU7xP2avhWfQ9V5xTQ91H7LYJj-PQ8fs6BgaMEbBRGw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
