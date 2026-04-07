const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envFile = fs.readFileSync('.env.local', 'utf8');
const lines = envFile.split(/\r?\n/);
let SUPA_URL = '';
let SUPA_KEY = '';

for (const line of lines) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) SUPA_URL = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) SUPA_KEY = line.split('=')[1].trim();
}

const supabase = createClient(SUPA_URL, SUPA_KEY);

async function check() {
  const { data: convs } = await supabase.from('conversations').select('*');
  console.log("Conversations:", convs);
  
  const { data: msgs } = await supabase.from('messages').select('*');
  console.log("Messages:", msgs);
}

check();
