# Admin Email Setup Guide

This guide explains how to add new admin email addresses to the ESRentals admin panel.

## Current System Overview

- **Email Domain Restriction**: Only `@esrentals.com` email addresses are allowed
- **Authentication**: Uses Supabase Auth with admin privileges stored in the `users` table
- **Validation**: Email must end with `@esrentals.com` to be considered valid

## Method 1: Using the Script (Recommended)

### Prerequisites
1. Ensure your `.env.local` file has the required Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

2. Make sure Supabase is running (if using local development)

### Adding a New Admin Email

#### Option A: Create Default Admin
```bash
npm run create:admin
```
This creates the default admin user: `admin@esrentals.com`

#### Option B: Create Custom Admin User
```bash
npm run create:admin <email> <password>
```

**Examples:**
```bash
# Create admin with custom email
npm run create:admin john@esrentals.com mySecurePassword123

# Create another admin
npm run create:admin sarah@esrentals.com anotherSecurePass456
```

### What the Script Does

1. **Validates Email Domain**: Ensures the email ends with `@esrentals.com`
2. **Creates Auth User**: Adds the user to Supabase Auth system
3. **Sets Admin Privileges**: Grants admin access in the `users` table
4. **Handles Existing Users**: If the user already exists, it updates their password and ensures admin privileges

## Method 2: Manual Database Setup

If you prefer to set up admin users manually, follow these steps:

### Step 1: Create User in Supabase Auth
```sql
-- This is handled by Supabase Auth API
-- You would need to use the Supabase dashboard or API
```

### Step 2: Add Admin Entry to Users Table
```sql
INSERT INTO users (id, email, is_admin) 
VALUES ('user-uuid-from-auth', 'newadmin@esrentals.com', true);
```

## Method 3: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User**
4. Enter the email (must be `@esrentals.com`)
5. Set a password
6. Go to **Table Editor** → **users**
7. Add a row with:
   - `id`: The user's UUID from auth
   - `email`: The admin email
   - `is_admin`: `true`

## Verification

After adding an admin email, you can verify it works by:

1. **Login Test**: Try logging in at `/admin/login`
2. **Database Check**: Verify the user exists in both auth and users table
3. **Admin Panel Access**: Ensure the user can access protected admin routes

## Troubleshooting

### Common Issues

1. **"Only @esrentals.com email addresses allowed"**
   - Solution: Use an email that ends with `@esrentals.com`

2. **"Authentication failed"**
   - Check if the user exists in Supabase Auth
   - Verify the password is correct
   - Ensure the user has admin privileges in the `users` table

3. **"Admin access required"**
   - The user exists in auth but doesn't have admin privileges
   - Run the script again or manually set `is_admin = true`

### Checking Existing Admin Users

```bash
# List all admin users in the database
npm run test:supabase
```

## Security Best Practices

1. **Strong Passwords**: Use complex passwords for admin accounts
2. **Regular Rotation**: Change admin passwords periodically
3. **Limited Access**: Only give admin access to trusted team members
4. **Monitor Usage**: Regularly check admin panel access logs

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify your Supabase configuration
3. Ensure the user has proper permissions in both auth and database 