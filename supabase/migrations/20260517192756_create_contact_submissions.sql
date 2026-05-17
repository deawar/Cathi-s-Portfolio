/*
  # Create contact_submissions table

  ## Purpose
  Stores all contact form submissions from cathiwarren.art so the artist
  has a persistent record even if email delivery fails.

  ## New Tables
  - `contact_submissions`
    - `id` (uuid, primary key) — unique identifier
    - `name` (text) — sender's name
    - `email` (text) — sender's email address
    - `subject` (text) — message subject, may be empty
    - `message` (text) — full message body
    - `created_at` (timestamptz) — submission timestamp

  ## Security
  - RLS enabled; table is locked down by default
  - INSERT policy: allows anyone (unauthenticated) to submit a form — this is
    a public-facing contact form, no auth required
  - SELECT/UPDATE/DELETE: no public policies — only accessible via the
    service role key (server-side API route)
*/

CREATE TABLE IF NOT EXISTS contact_submissions (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL DEFAULT '',
  email      text NOT NULL DEFAULT '',
  subject    text NOT NULL DEFAULT '',
  message    text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
