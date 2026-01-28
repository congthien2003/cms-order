-- Manually update admin password hash to use correct format
-- Password: Admin@123
-- This script should be run after fixing DbInitializer.cs

-- You can either:
-- 1. Stop the server, drop database, and run again to reseed
-- 2. Or manually update using the correct hash generated from Hashing.cs

-- Example (you need to generate the actual hash from your code):
-- UPDATE "Users" 
-- SET "PasswordHash" = 'YOUR_HEX_HASH_HERE',
--     "Salting" = 'YOUR_BASE64_SALT_HERE'
-- WHERE "Email" = 'admin@storeorder.com';
