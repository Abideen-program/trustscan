-- TrustScan — Supabase Database Schema
-- Run this script in the Supabase SQL Editor to set up your database.

-- Drop table if it already exists
DROP TABLE IF EXISTS scan_results;

-- Create scan_results table
CREATE TABLE scan_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    risk_score INT2 NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
    verdict TEXT NOT NULL CHECK (verdict IN ('safe', 'suspicious', 'high_risk')),
    summary TEXT NOT NULL,
    flags JSONB NOT NULL DEFAULT '[]'::jsonb,
    what_to_do JSONB NOT NULL DEFAULT '[]'::jsonb,
    scam_type TEXT NOT NULL,
    input_type TEXT NOT NULL CHECK (input_type IN ('text', 'url', 'image')),
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days')
);

-- Enable Row-Level Security (RLS)
ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

-- Create Policies

-- 1. Allow Anyone to read scan results (either for the library or for a shared results page)
CREATE POLICY "Allow public select" 
ON scan_results 
FOR SELECT 
USING (true);

-- 2. Allow Anyone to insert new scan results (so the client/serverless API can insert anonymous scans)
CREATE POLICY "Allow public insert" 
ON scan_results 
FOR INSERT 
WITH CHECK (true);

-- Create performance indexes for standard queries
CREATE INDEX IF NOT EXISTS idx_scan_results_created_at ON scan_results (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_scan_results_scam_type ON scan_results (scam_type);

-- Optional: Automatic cron-like function to clean up expired scans (TTL).
-- In Supabase, this can also be handled by PgCron or a periodic database function,
-- but the columns exist so we can also filter expires_at > now() in our queries.
