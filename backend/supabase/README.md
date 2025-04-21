# ReturnBox Supabase Backend

This directory contains the Supabase configuration for the ReturnBox application.

## Setup Instructions

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)

2. Copy your project URL and anon key from the project settings

3. Create a `.env` file in the frontend root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Apply the database migrations:
   - Go to the SQL editor in your Supabase dashboard
   - Copy the contents of `migrations/20240124000000_init.sql`
   - Execute the SQL to create the necessary tables and policies

## Database Schema

### Profiles Table
- Stores user profile information
- Linked to Supabase Auth users
- Supports both customer and merchant profiles

### Returns Table
- Manages return requests
- Links customers and merchants
- Tracks return status and details

## Security

- Row Level Security (RLS) is enabled on all tables
- Custom policies ensure users can only access their own data
- Merchants can only view and update returns assigned to them
- Customers can only view and create their own returns

## Type Safety

The project includes TypeScript definitions for the database schema in `src/lib/database.types.ts`. These types are automatically used with the Supabase client to ensure type safety across the application.