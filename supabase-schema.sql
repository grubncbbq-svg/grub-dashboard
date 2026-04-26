-- GRUB Smokehouse Dashboard — Supabase Schema
-- Run this in Supabase: SQL Editor → New query → paste → Run

-- Price Book: master ingredient price table
create table if not exists price_book (
  id uuid default gen_random_uuid() primary key,
  name text not null,           -- normalized ingredient name, e.g. "Beef Cheek Meat"
  vendor text,                  -- Sam's Club, Sysco, Restaurant Depot, etc.
  unit text not null,           -- lb, oz, each, cup, etc.
  price numeric(10,4) not null, -- most recent price per unit
  updated_at date not null default current_date,
  created_at timestamptz default now()
);

-- Price history: tracks price changes over time
create table if not exists price_history (
  id uuid default gen_random_uuid() primary key,
  ingredient_name text not null,
  price numeric(10,4) not null,
  vendor text,
  recorded_date date not null default current_date,
  receipt_id uuid,              -- links back to the receipt it came from
  created_at timestamptz default now()
);

-- Receipts: one row per uploaded receipt photo
create table if not exists receipts (
  id uuid default gen_random_uuid() primary key,
  vendor text,
  receipt_date date,
  total numeric(10,2),
  image_url text,               -- future: store image in Supabase Storage
  raw_text text,                -- raw Claude Vision output for reference
  status text default 'pending', -- pending | reviewed | confirmed
  created_at timestamptz default now()
);

-- Receipt items: individual line items extracted from each receipt
create table if not exists receipt_items (
  id uuid default gen_random_uuid() primary key,
  receipt_id uuid references receipts(id) on delete cascade,
  name text not null,           -- raw name from receipt
  normalized_name text,         -- matched to price_book ingredient name
  quantity numeric(10,3),
  unit text,
  unit_price numeric(10,4),
  total_price numeric(10,2),
  category text,                -- R (restaurant) | H (home) | S (supply)
  confirmed boolean default false,
  created_at timestamptz default now()
);

-- Indexes for common lookups
create index if not exists price_book_name_idx on price_book(lower(name));
create index if not exists receipt_items_receipt_id_idx on receipt_items(receipt_id);
create index if not exists price_history_ingredient_idx on price_history(ingredient_name);
