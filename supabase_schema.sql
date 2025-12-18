-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text check (role in ('admin', 'reseller')) default 'reseller',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table profiles enable row level security;

-- RLS: Users can view their own profile
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

-- RLS: Admins can view all profiles
create policy "Admins can view all profiles" on profiles
  for select using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- 2. KITS TABLE
create table kits (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table kits enable row level security;

-- 3. LEADS TABLE
create table leads (
  id uuid default uuid_generate_v4() primary key,
  reseller_id uuid references profiles(id) not null,
  name text not null,
  email text,
  phone text,
  status text default 'new',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table leads enable row level security;

-- 4. APPLICATIONS TABLE
create table applications (
  id uuid default uuid_generate_v4() primary key,
  reseller_id uuid references profiles(id) not null,
  applicant_name text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table applications enable row level security;

-- 5. JUNCTION TABLE: RESELLER_KITS
create table reseller_kits (
  id uuid default uuid_generate_v4() primary key,
  reseller_id uuid references profiles(id) on delete cascade not null,
  kit_id uuid references kits(id) on delete cascade not null,
  assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(reseller_id, kit_id)
);

-- Enable RLS
alter table reseller_kits enable row level security;


-- RLS RULES DETAIL

-- KITS
-- Admins can do everything
create policy "Admins can do everything on kits" on kits
  for all using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Resellers can view kits assigned to them
create policy "Resellers can view assigned kits" on kits
  for select using (
    exists (
      select 1 from reseller_kits
      where kit_id = kits.id
      and reseller_id = auth.uid()
    )
  );


-- LEADS
-- Admins can view all
create policy "Admins can view all leads" on leads
  for select using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Resellers can CRUD their own leads
create policy "Resellers can CRUD own leads" on leads
  for all using (
    reseller_id = auth.uid()
  );


-- APPLICATIONS
-- Admins can view all
create policy "Admins can view all applications" on applications
  for select using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Resellers can CRUD their own applications
create policy "Resellers can CRUD own applications" on applications
  for all using (
    reseller_id = auth.uid()
  );


-- RESELLER_KITS
-- Admins can do everything
create policy "Admins can do everything on reseller_kits" on reseller_kits
  for all using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Resellers can view their assignments
create policy "Resellers can view own assignments" on reseller_kits
  for select using (
    reseller_id = auth.uid()
  );

-- TRIGGER FOR NEW USER CREATION (Optional but recommended)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', 'reseller');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
