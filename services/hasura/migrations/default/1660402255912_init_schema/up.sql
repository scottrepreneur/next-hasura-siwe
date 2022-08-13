CREATE TABLE public.users (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    address text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
