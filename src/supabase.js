import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://afndydgblvhxmfjmxrhu.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbmR5ZGdibHZoeG1mam14cmh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMTM0NjMsImV4cCI6MjA1OTg4OTQ2M30.luxnJlxqw3Vl3-33tq_1gtX0wXQU6Yh-ZfBIfkCGUvk";
export const supabase = createClient(supabaseUrl, supabaseKey);