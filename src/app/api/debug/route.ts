import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    env: {
      SILICONFLOW_API_KEY: process.env.SILICONFLOW_API_KEY ? '***' + process.env.SILICONFLOW_API_KEY.slice(-4) : 'NOT FOUND',
      SILICONFLOW_MODEL: process.env.SILICONFLOW_MODEL || 'NOT SET',
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
    },
    nodeEnv: process.env.NODE_ENV
  })
}