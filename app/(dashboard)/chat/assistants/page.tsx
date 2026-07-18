"use client"
import React, { useState, useEffect, useRef } from 'react';
import "../assitant.css"

// TypeScript interfaces
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  emailVerified: boolean;
  role: 'user' | 'admin' | 'moderator';
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'read' | 'error';
  type?: 'text' | 'code' | 'image' | 'file' | 'quick-reply';
  code?: string;
  language?: string;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
  color: string;
  gradient?: string;
}

interface Suggestion {
  id: string;
  text: string;
  category: 'question' | 'action' | 'info';
}

interface AssistantProps {
  user?: User;
}

const sampleUser: User = {
  id: "6a54cf1073bd4e0ee941beb3",
  firstName: "Hazrat",
  lastName: "usman",
  email: "hazrat17780@gmail.com",
  username: "hazrat17780",
  emailVerified: true,
  role: "user"
};

const mockResponses = [
  "I can help you with that! Let me gather the information you need.",
  "That's a great question. Here's what I found...",
  "I understand. Would you like me to explain further?",
  "Based on your analytics, I recommend focusing on user engagement this week.",
  "I've analyzed your data and found some interesting patterns.",
  "Sure! Let me break that down for you step by step.",
  "I see you're asking about user growth. Your current rate is 12.5% month-over-month.",
  "Here's a tip: consider implementing the new feature to boost retention.",
];

const AssistantPage: React.FC<AssistantProps> = ({ user = sampleUser }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `👋 Hello ${user.firstName}! I'm your AI assistant. I can help you with analytics, answer questions, suggest improvements, and more. How can I assist you today?`,
      sender: 'assistant',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'analytics' | 'support' | 'tasks'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    { id: 'analytics', label: 'Analytics', icon: '📊', action: 'Show me the analytics summary for this week', color: '#667eea', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'users', label: 'User Growth', icon: '👥', action: 'How are our user numbers looking?', color: '#48bb78', gradient: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)' },
    { id: 'revenue', label: 'Revenue', icon: '💰', action: 'What\'s the revenue forecast?', color: '#ed8936', gradient: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)' },
    { id: 'suggestions', label: 'Suggestions', icon: '💡', action: 'Give me some improvement suggestions', color: '#9f7aea', gradient: 'linear-gradient(135deg, #9f7aea 0%, #805ad5 100%)' },
    { id: 'help', label: 'Help', icon: '❓', action: 'What can you help me with?', color: '#fc8181', gradient: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)' },
    { id: 'report', label: 'Report', icon: '📄', action: 'Generate a detailed report for me', color: '#4299e1', gradient: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)' },
  ];

  const suggestions: Suggestion[] = [
    { id: '1', text: 'What are my top performing metrics?', category: 'analytics' },
    { id: '2', text: 'How can I improve conversion rates?', category: 'analytics' },
    { id: '3', text: 'Show me user retention data', category: 'analytics' },
    { id: '4', text: 'What tasks do I need to complete?', category: 'tasks' },
    { id: '5', text: 'How do I create a new campaign?', category: 'support' },
    { id: '6', text: 'Analyze my recent traffic', category: 'analytics' },
    { id: '7', text: 'What\'s new in the platform?', category: 'support' },
    { id: '8', text: 'Set up a meeting reminder', category: 'tasks' },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    
    if (lowerMsg.includes('analytics') || lowerMsg.includes('summary') || lowerMsg.includes('metrics')) {
      return `📊 **Analytics Summary**\n\nYour current metrics:\n• Total Users: 12,847 (↑12.5%)\n• Active Sessions: 3,421 (↑8.3%)\n• Revenue: $48,293 (↑23.1%)\n• Conversion Rate: 3.42% (↓2.1%)\n\nWould you like a detailed breakdown?`;
    }
    
    if (lowerMsg.includes('user') || lowerMsg.includes('growth') || lowerMsg.includes('signup')) {
      return `👥 **User Growth Analysis**\n\nUser growth has been steady this month:\n• New signups: +2,340\n• Daily average: 78 new users\n• Most active day: Friday (220 users)\n• Top region: United States (33.1%)\n\nProjection for next month: ~2,800 new users.`;
    }
    
    if (lowerMsg.includes('revenue') || lowerMsg.includes('income') || lowerMsg.includes('money')) {
      return `💰 **Revenue Report**\n\nCurrent revenue: $48,293\n• Monthly growth: 23.1%\n• Average order value: $124.50\n• Top product: Premium Plan ($29/mo)\n• Projected Q4 revenue: $145,000\n\nYou're on track to exceed quarterly targets!`;
    }
    
    if (lowerMsg.includes('suggestion') || lowerMsg.includes('improve') || lowerMsg.includes('recommend')) {
      return `💡 **Improvement Suggestions**\n\nBased on your data, I recommend:\n\n1. 🎯 **Focus on user onboarding** - New users drop off at 30%\n2. 📱 **Optimize mobile experience** - 35% of users are on mobile\n3. 📧 **Send re-engagement emails** - Inactive users: 1,200\n4. 🔄 **A/B test pricing page** - Current conversion: 3.42%\n\nWould you like me to elaborate on any of these?`;
    }
    
    if (lowerMsg.includes('help') || lowerMsg.includes('what can you do')) {
      return `🤖 **What I can help you with**\n\nI can assist you with:\n• 📊 Analytics & reporting\n• 👥 User insights\n• 💰 Revenue tracking\n• 💡 Improvement suggestions\n• 📝 Task management\n• 🔍 Data analysis\n• 🚀 Growth strategies\n• ❓ General questions\n\nJust ask me anything!`;
    }
    
    if (lowerMsg.includes('report') || lowerMsg.includes('generate')) {
      return `📄 **Generating Report**\n\nI'm preparing a comprehensive report for you:\n\n✅ User analytics\n✅ Revenue metrics\n✅ Growth indicators\n✅ Performance insights\n✅ Recommendations\n\n⏳ Report will be ready in a few moments. Would you like me to email it to you?`;
    }
    
    if (lowerMsg.includes('campaign') || lowerMsg.includes('marketing')) {
      return `📢 **Campaign Creation**\n\nTo create a new campaign:\n\n1. **Define target audience** - Use your user segments\n2. **Set campaign goals** - New signups, engagement, etc.\n3. **Choose channels** - Email, social, in-app\n4. **Create content** - I can help draft copy\n5. **Set budget & schedule**\n\nWould you like me to help you set up a campaign?`;
    }

    if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
      return `👋 Hello! How can I assist you today? I can help with analytics, user insights, revenue tracking, and much more.`;
    }

    const randomIndex = Math.floor(Math.random() * mockResponses.length);
    return mockResponses[randomIndex] + `\n\nIs there anything specific you'd like me to help with?`;
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(messageContent);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        sender: 'assistant',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleQuickAction = (action: QuickAction) => {
    setSelectedQuickAction(action.id);
    handleSendMessage(action.action);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    handleSendMessage(suggestion.text);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputMessage);
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getFilteredSuggestions = () => {
    if (activeCategory === 'all') return suggestions;
    return suggestions.filter(s => s.category === activeCategory);
  };

  return (
    <div className="assistant-wrapper">
      <div className="assistant-container">
        {/* Sidebar */}
        <div className="assistant-sidebar">
          <div className="sidebar-header">
            <div className="assistant-avatar">
              <span className="assistant-emoji">🤖</span>
              <div className="status-indicator online"></div>
            </div>
            <h2 className="assistant-name">AI Assistant</h2>
            <span className="assistant-status">
              <span className="status-dot"></span> Online
            </span>
          </div>

          <div className="quick-actions">
            <h3 className="sidebar-title">Quick Actions</h3>
            <div className="actions-grid">
              {quickActions.map(action => (
                <button
                  key={action.id}
                  className={`quick-action-btn ${selectedQuickAction === action.id ? 'active' : ''}`}
                  onClick={() => handleQuickAction(action)}
                  style={{ 
                    '--action-color': action.color,
                    '--action-gradient': action.gradient
                  } as React.CSSProperties}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="user-info-sidebar">
            <div className="sidebar-divider"></div>
            <div className="user-card">
              <div className="user-card-avatar">
                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
              </div>
              <div className="user-card-info">
                <span className="user-card-name">{user.firstName} {user.lastName}</span>
                <span className="user-card-role">{user.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="assistant-main">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-header-icon">💬</div>
              <div>
                <h3 className="chat-title">Conversation</h3>
                <span className="chat-subtitle">Active now</span>
              </div>
            </div>
            <div className="chat-header-actions">
              <button className="header-action-btn" title="Clear chat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                </svg>
              </button>
              <button className="header-action-btn" title="Export chat">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
              </button>
              <button className="header-action-btn" title="Settings">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message-wrapper ${message.sender === 'user' ? 'user-message' : 'assistant-message'}`}
              >
                <div className="message-avatar">
                  {message.sender === 'user' ? (
                    <span className="user-avatar-small">{user.firstName.charAt(0)}</span>
                  ) : (
                    <span className="assistant-avatar-small">🤖</span>
                  )}
                </div>
                <div className="message-content-wrapper">
                  <div className="message-bubble">
                    <div className="message-text">
                      {message.content.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < message.content.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                    <span className="message-time">{formatTime(message.timestamp)}</span>
                  </div>
                  {message.status === 'sending' && (
                    <span className="message-status sending">Sending...</span>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message-wrapper assistant-message">
                <div className="message-avatar">
                  <span className="assistant-avatar-small">🤖</span>
                </div>
                <div className="message-content-wrapper">
                  <div className="message-bubble typing-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          <div className="suggestions-section">
            <div className="suggestions-header">
              <span className="suggestions-title">💡 Suggested Questions</span>
              <div className="suggestion-categories">
                <button
                  className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All
                </button>
                <button
                  className={`category-btn ${activeCategory === 'analytics' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('analytics')}
                >
                  📊 Analytics
                </button>
                <button
                  className={`category-btn ${activeCategory === 'support' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('support')}
                >
                  🛟 Support
                </button>
                <button
                  className={`category-btn ${activeCategory === 'tasks' ? 'active' : ''}`}
                  onClick={() => setActiveCategory('tasks')}
                >
                  ✅ Tasks
                </button>
              </div>
            </div>
            <div className="suggestions-list">
              {getFilteredSuggestions().map((suggestion) => (
                <button
                  key={suggestion.id}
                  className="suggestion-chip"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.text}
                  <span className="suggestion-arrow">→</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="chat-input-area">
            <div className="input-wrapper">
              <button className="input-action-btn" title="Attach file">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
              </button>
              <button className="input-action-btn" title="Voice input">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1v5M8 4h8M12 9a3 3 0 00-3 3v3a3 3 0 006 0v-3a3 3 0 00-3-3z"/>
                  <path d="M19 12a7 7 0 01-14 0"/>
                </svg>
              </button>
              <input
                ref={inputRef}
                type="text"
                className="chat-input"
                placeholder="Ask me anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                className={`send-btn ${inputMessage.trim() ? 'active' : ''}`}
                onClick={() => handleSendMessage(inputMessage)}
                disabled={!inputMessage.trim()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </button>
            </div>
            <div className="input-footer">
              <span className="footer-text">AI assistant is ready to help</span>
              <span className="footer-text">Powered by AI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;