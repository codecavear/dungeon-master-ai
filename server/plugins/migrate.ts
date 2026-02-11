/**
 * Auto-run database migrations on server startup (production only)
 * 
 * This ensures the database schema is always up to date
 * when deploying to Railway or other production environments.
 */

export default defineNitroPlugin(async () => {
  // Only run migrations in production to avoid conflicts during development
  if (process.env.NODE_ENV !== 'production') {
    console.log('⏭️  Skipping migrations (dev mode - use `bun run db:push` manually)')
    return
  }

  console.log('🔄 Running database migrations...')
  
  try {
    const { db } = await import('../db')
    const { migrate } = await import('drizzle-orm/postgres-js/migrator')
    
    await migrate(db, { 
      migrationsFolder: 'server/db/migrations',
      migrationsTable: 'drizzle_migrations'
    })
    
    console.log('✅ Database migrations completed successfully')
  } catch (error) {
    console.error('❌ Database migration failed:', error)
    // Don't throw - let the app start anyway
    // This allows manual intervention if needed
  }
})
