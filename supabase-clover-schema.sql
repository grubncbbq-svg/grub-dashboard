-- GRUB Dashboard — Clover sales data schema
-- Run this in Supabase: SQL Editor → New query → paste → Run

-- Daily sales rollup (denormalized for fast dashboard reads)
create table if not exists daily_sales (
  date date primary key,
  net_sales numeric(10,2) default 0,
  gross_sales numeric(10,2) default 0,
  tax numeric(10,2) default 0,
  tip numeric(10,2) default 0,
  refunds numeric(10,2) default 0,
  discounts numeric(10,2) default 0,
  order_count int default 0,
  item_count int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tender breakdown by date (Credit, Debit, Cash, etc.)
create table if not exists daily_tenders (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  tender_name text not null,
  amount numeric(10,2) default 0,
  txn_count int default 0,
  created_at timestamptz default now(),
  unique(date, tender_name)
);

-- Item sales by date (what's selling)
create table if not exists daily_item_sales (
  id uuid default gen_random_uuid() primary key,
  date date not null,
  item_name text not null,
  item_id text,
  quantity int default 0,
  revenue numeric(10,2) default 0,
  created_at timestamptz default now(),
  unique(date, item_name)
);

-- Sync log (track when last pulled from Clover)
create table if not exists sync_log (
  id uuid default gen_random_uuid() primary key,
  source text not null, -- 'clover'
  start_date date,
  end_date date,
  orders_synced int default 0,
  status text default 'success', -- success | error
  error_message text,
  duration_ms int,
  created_at timestamptz default now()
);

-- RLS policies
alter table daily_sales enable row level security;
alter table daily_tenders enable row level security;
alter table daily_item_sales enable row level security;
alter table sync_log enable row level security;

create policy "allow all" on daily_sales for all using (true) with check (true);
create policy "allow all" on daily_tenders for all using (true) with check (true);
create policy "allow all" on daily_item_sales for all using (true) with check (true);
create policy "allow all" on sync_log for all using (true) with check (true);

-- Indexes
create index if not exists daily_sales_date_idx on daily_sales(date desc);
create index if not exists daily_tenders_date_idx on daily_tenders(date desc);
create index if not exists daily_item_sales_date_idx on daily_item_sales(date desc);
create index if not exists daily_item_sales_revenue_idx on daily_item_sales(revenue desc);
