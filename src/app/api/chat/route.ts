import { NextRequest, NextResponse } from 'next/server'

// SiliconFlow API configuration
const SILICONFLOW_API_URL = 'https://api.siliconflow.cn/v1/chat/completions'
const SILICONFLOW_MODEL = process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V2.5'

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface SiliconFlowRequest {
  model: string
  messages: ChatMessage[]
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

interface SiliconFlowResponse {
  choices: Array<{
    message: {
      role: string
      content: string
    }
    finish_reason: string
  }>
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CHAT API CALLED ===')
    
    const { message, chatId } = await request.json()
    console.log('Received message:', message)

    if (!message) {
      console.error('No message provided')
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Get API key from environment variables
    const apiKey = process.env.SILICONFLOW_API_KEY
    const model = process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V2.5'
    
    console.log('Environment check:', {
      apiKey: apiKey ? '***' + apiKey.slice(-4) : 'MISSING',
      model: model
    })
    
    if (!apiKey) {
      console.error('SiliconFlow API key not found in environment variables')
      return NextResponse.json(
        { error: 'API configuration error - API key missing' },
        { status: 500 }
      )
    }

    // Prepare the request payload for SiliconFlow
    const payload = {
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant. Be concise and helpful in your responses.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: false
    }

    console.log('Payload being sent:', JSON.stringify(payload, null, 2))

    // Make request to SiliconFlow API
    console.log('Sending request to SiliconFlow API...')
    
    const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload)
    })

    console.log('SiliconFlow API response status:', response.status, response.statusText)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('SiliconFlow API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      })
      return NextResponse.json(
        { error: `Failed to get response from AI service: ${response.status} ${response.statusText}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    console.log('SiliconFlow API success response:', JSON.stringify(data, null, 2))

    // Extract the assistant's response
    const assistantResponse = data.choices[0]?.message?.content || 'No response received'

    return NextResponse.json({
      response: assistantResponse,
      usage: data.usage
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}