import { initializeDatabase, testConnection } from '@/lib/db/init';

async function main() {
  console.log('Testing PostgreSQL connection...');
  const connectionSuccess = await testConnection();
  
  if (!connectionSuccess) {
    console.error('Failed to connect to PostgreSQL database');
    process.exit(1);
  }
  
  console.log('Initializing database schema...');
  await initializeDatabase();
  
  console.log('Database initialization completed successfully!');
}

main().catch(console.error);
