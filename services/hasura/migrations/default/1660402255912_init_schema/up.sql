CREATE TABLE public.users (
    address text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY ("address"),
    UNIQUE ("address")
);
CREATE TABLE public.contracts (
    address text NOT NULL,
    name text NOT NULL,
    chain_id integer NOT NULL,
    user_id text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    PRIMARY KEY ("address"),
    FOREIGN KEY ("user_id") REFERENCES "public"."users"("address") ON UPDATE restrict ON DELETE restrict,
    UNIQUE ("address", "chain_id")
);