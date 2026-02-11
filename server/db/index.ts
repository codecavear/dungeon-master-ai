/**
 * Database Connection
 * Using Drizzle ORM with PostgreSQL (postgres.js driver)
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Create connection lazily to avoid issues during build
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null
let _client: ReturnType<typeof postgres> | null = null

export function useDatabase() {
  if (!_db) {
    const config = useRuntimeConfig()
    
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL is not configured')
    }
    
    _client = postgres(config.databaseUrl)
    _db = drizzle(_client, { schema })
  }
  
  return _db
}

// Export for direct imports (when runtime config is available)
export const db = {
  get instance() {
    return useDatabase()
  },
}

// Re-export schema for convenience
export * from './schema'
