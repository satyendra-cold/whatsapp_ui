-- WhatsDash Multi-Tenant Database Schema

-- Enable UUID extension just in case it isn't enabled by default
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Whatsapp Configs
CREATE TABLE whatsapp_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number_id TEXT NOT NULL,
  waba_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  webhook_verify_token TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 2. Contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  name TEXT,
  profile_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, phone_number)
);

-- 3. Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  unread_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, contact_id)
);

-- 4. Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  wa_message_id TEXT UNIQUE,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  content TEXT,
  message_type TEXT DEFAULT 'text',
  status TEXT DEFAULT 'sent',
  delivered_at TIMESTAMPTZ,
  seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE whatsapp_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create Policies for whatsapp_configs
CREATE POLICY "Users can manage their own config"
ON whatsapp_configs
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create Policies for contacts
CREATE POLICY "Users can manage their own contacts"
ON contacts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create Policies for conversations
CREATE POLICY "Users can manage their own conversations"
ON conversations
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create Policies for messages
CREATE POLICY "Users can manage their own messages"
ON messages
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enable Realtime
-- Go to Supabase Dashboard -> Database -> Replication and enable Realtime for "conversations" and "messages".
-- Or execute the replication command if your permissions allow:
alter publication supabase_realtime add table conversations;
alter publication supabase_realtime add table messages;
