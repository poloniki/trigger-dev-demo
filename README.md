# Example Table and Policy

## Table and Policy SQL

```sql
CREATE TABLE public.example (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NULL,
  CONSTRAINT example_pkey PRIMARY KEY (id),
  CONSTRAINT example_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

ALTER POLICY "ReadUser"
ON "public"."example"
TO public
USING (
  (auth.uid() = user_id)
);
