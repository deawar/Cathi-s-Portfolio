/*
  # Fix contact_submissions RLS policy

  ## Issue
  The previous INSERT policy had `WITH CHECK (true)`, which bypasses RLS security
  by allowing any insert without validation.

  ## Solution
  Replace with a restrictive policy that validates:
  - All required fields are non-empty (name, email, message)
  - Email format is roughly valid (contains @ and .)
  - Message length is reasonable (10+ chars to prevent spam)
  - Subject is optional but capped at reasonable length

  ## Changes
  - Drop the overly permissive policy
  - Add new policy with proper field validation
*/

DROP POLICY IF EXISTS "Anyone can submit contact form" ON contact_submissions;

CREATE POLICY "Validated contact form submission"
  ON contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name ~ '^\s*\S.*$'
    AND email ~ '^[^@]+@[^@]+\.[^@]+$'
    AND length(message) >= 10
    AND length(message) <= 5000
    AND length(subject) <= 500
    AND length(name) <= 200
    AND length(email) <= 254
  );
