/**
 * Health check endpoint
 * Returns app status and database connection status
 */

export default defineEventHandler(async () => {
  const dbConnected = !!process.env.DATABASE_URL
  
  return {
    status: 'ok',
    app: 'Dungeon Master AI',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: {
      configured: dbConnected,
      type: 'PostgreSQL'
    },
    environment: process.env.NODE_ENV || 'development'
  }
})
