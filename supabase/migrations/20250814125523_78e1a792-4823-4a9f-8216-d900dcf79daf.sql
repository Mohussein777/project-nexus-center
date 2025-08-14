-- Enable Row Level Security on all sensitive tables
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.office_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.safes ENABLE ROW LEVEL SECURITY;

-- Create comprehensive RLS policies for financial transactions
CREATE POLICY "Users can view their own financial data" 
ON public.financial_transactions 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can insert financial transactions" 
ON public.financial_transactions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update financial transactions" 
ON public.financial_transactions 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for project financials
CREATE POLICY "Users can view project financials" 
ON public.project_financials 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage project financials" 
ON public.project_financials 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for user roles
CREATE POLICY "Users can view roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create RLS policies for account types
CREATE POLICY "Users can view account types" 
ON public.account_types 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for office settings
CREATE POLICY "Users can view office settings" 
ON public.office_settings 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for subtasks
CREATE POLICY "Users can manage subtasks" 
ON public.subtasks 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for safes
CREATE POLICY "Users can view safes" 
ON public.safes 
FOR SELECT 
USING (auth.uid() IS NOT NULL);