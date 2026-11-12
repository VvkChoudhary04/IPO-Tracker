import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  apiPrefix: process.env.API_PREFIX || '/api',

  // Supabase Configuration
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',

  // Database Connection Strings
  databaseUrl: process.env.DATABASE_URL || '',
  directUrl: process.env.DIRECT_URL || '',

  // Cryptographic Keys (Hex encoded 32-byte keys)
  panEncryptionKey: process.env.PAN_ENCRYPTION_KEY || '',
  panBlindIndexKey: process.env.PAN_BLIND_INDEX_KEY || '',
};
