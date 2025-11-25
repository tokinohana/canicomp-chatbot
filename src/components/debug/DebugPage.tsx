'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DebugPage() {
  const [debugResult, setDebugResult] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testDebug = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug')
      const data = await response.json()
      setDebugResult(data)
    } catch (error) {
      setDebugResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const testAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test')
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({ error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">SiliconFlow API Debug</h1>
      
      <div className="flex gap-4">
        <Button onClick={testDebug} disabled={loading}>
          Test Environment Variables
        </Button>
        <Button onClick={testAPI} disabled={loading}>
          Test API Connection
        </Button>
      </div>

      {debugResult && (
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(debugResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      {testResult && (
        <Card>
          <CardHeader>
            <CardTitle>API Connection Test</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}