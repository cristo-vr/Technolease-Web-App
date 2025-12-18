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
-- Helper function to check if user is admin (Bypasses RLS to avoid recursion)
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- RLS: Admins can view all profiles
create policy "Admins can view all profiles" on profiles
  for select using (
    is_admin()
  );

-- 2. KITS TABLE
create table kits (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  deal_code text,
  marketing_description text,
  rental_price numeric,
  rental_term text,
  hero_image_url text,
  detail1_image_url text,
  detail2_image_url text,
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

-- STORAGE POLICIES (Run these in SQL Editor after creating 'kit-images' bucket)
-- 1. Allow public access to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'kit-images' );

-- 2. Allow authenticated users to upload images
create policy "Authenticated users can upload"
on storage.objects for insert
with check (
  auth.role() = 'authenticated' AND
  bucket_id = 'kit-images'
);

-- 3. Allow users to update their own images (or admins to update any)
create policy "Users can update own images"
on storage.objects for update
using (
  auth.uid() = owner OR
  (select count(*) from profiles where id = auth.uid() and role = 'admin') > 0
);

-- 6. RESELLER APPLICATIONS (Pipeline)
create table reseller_applications (
  id uuid default uuid_generate_v4() primary key,
  company_name text not null,
  applicant_name text not null,
  email text not null,
  phone text,
  status text check (status in ('new', 'contacted', 'reviewing', 'approved', 'rejected')) default 'new',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table reseller_applications enable row level security;

-- POLICIES
-- Admins can view/update all applications
create policy "Admins can do everything on reseller_applications" on reseller_applications
  for all using (
    exists (
      select 1 from profiles where id = auth.uid() and role = 'admin'
    )
  );

-- Service Role (for external form) or Public (if form is unauthed) needs insert access
create policy "Public can submit applications" on reseller_applications
  for insert with check (true);
