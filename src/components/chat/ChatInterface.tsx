'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MessageSquare, Plus, Edit2 } from 'lucide-react'

interface Message {
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface Chat {
  id: string
  name: string
  messages: Message[]
}

export default function ChatInterface() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentChat = chats.find(chat => chat.id === currentChatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name: 'New Chat',
      messages: []
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  const renameChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (!chat) return

    const newName = prompt('Rename chat:', chat.name)
    if (newName && newName.trim()) {
      setChats(prev => 
        prev.map(c => 
          c.id === chatId ? { ...c, name: newName.trim() } : c
        )
      )
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentChatId || isLoading) return

    const userMessage: Message = {
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    }

    // Update chat with user message
    setChats(prev => 
      prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      )
    )

    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          chatId: currentChatId
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        content: data.response,
        role: 'assistant',
        timestamp: new Date()
      }

      // Update chat with assistant response
      setChats(prev => 
        prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, assistantMessage] }
            : chat
        )
      )
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Add error message with more details
      const errorMessage: Message = {
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        role: 'assistant',
        timestamp: new Date()
      }

      setChats(prev => 
        prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, errorMessage] }
            : chat
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  useEffect(() => {
    if (chats.length === 0) {
      createNewChat()
    }
  }, [chats.length])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-muted border-r">
        <div className="p-4">
          <Button 
            onClick={createNewChat} 
            className="w-full justify-start gap-2"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        
        <Separator />
        
        <ScrollArea className="flex-1 h-[calc(100vh-120px)]">
          <div className="p-4 space-y-2">
            {chats.map((chat) => (
              <Card 
                key={chat.id} 
                className={`cursor-pointer transition-colors ${
                  currentChatId === chat.id ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-sm font-medium">
                        {chat.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        renameChat(chat.id)
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="border-b p-4">
              <CardTitle className="text-lg">{currentChat.name}</CardTitle>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4 max-w-4xl mx-auto">
                {currentChat.messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Start a conversation</p>
                    <p className="text-sm">Send a message to begin chatting</p>
                  </div>
                ) : (
                  currentChat.messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2 max-w-4xl mx-auto">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!inputMessage.trim() || isLoading}
                >
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Select a chat or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}