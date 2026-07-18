"use client"
import React, { useState, useEffect, useRef } from 'react';
import "../prompts.css"

// TypeScript Interfaces
interface Prompt {
  id: string;
  name: string;
  description: string;
  content: string;
  category: 'general' | 'analytics' | 'support' | 'marketing' | 'custom';
  tags: string[];
  variables: PromptVariable[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  usageCount: number;
  rating: number;
}

interface PromptVariable {
  name: string;
  description: string;
  defaultValue?: string;
  required: boolean;
}

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  prompt: string;
}

const PromptManagementPage: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: '1',
      name: 'Analytics Summary Generator',
      description: 'Generates a comprehensive analytics summary with key metrics',
      content: 'Generate a detailed analytics summary for {{timeframe}} showing:\n- Total users: {{totalUsers}}\n- Active users: {{activeUsers}}\n- Revenue: {{revenue}}\n- Key insights: {{insights}}\n\nProvide actionable recommendations based on this data.',
      category: 'analytics',
      tags: ['analytics', 'reporting', 'summary'],
      variables: [
        { name: 'timeframe', description: 'Time period for the report', defaultValue: 'this week', required: true },
        { name: 'totalUsers', description: 'Total user count', defaultValue: '12,847', required: true },
        { name: 'activeUsers', description: 'Active user count', defaultValue: '3,421', required: true },
        { name: 'revenue', description: 'Revenue amount', defaultValue: '$48,293', required: true },
        { name: 'insights', description: 'Key insights', defaultValue: 'Growth is steady', required: false }
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20'),
      isActive: true,
      usageCount: 147,
      rating: 4.8
    },
    {
      id: '2',
      name: 'User Onboarding Guide',
      description: 'Welcome new users with a personalized onboarding message',
      content: 'Welcome to {{productName}}! 🎉\n\nI\'m here to help you get started. Based on your role as a {{userRole}}, here\'s what you can do:\n\n1. {{firstStep}}\n2. {{secondStep}}\n3. {{thirdStep}}\n\nWould you like me to guide you through any of these steps?',
      category: 'support',
      tags: ['onboarding', 'welcome', 'users'],
      variables: [
        { name: 'productName', description: 'Product name', defaultValue: 'AI Assistant', required: true },
        { name: 'userRole', description: 'User role', defaultValue: 'new user', required: true },
        { name: 'firstStep', description: 'First step', defaultValue: 'Set up your profile', required: true },
        { name: 'secondStep', description: 'Second step', defaultValue: 'Explore the dashboard', required: true },
        { name: 'thirdStep', description: 'Third step', defaultValue: 'Try your first query', required: true }
      ],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18'),
      isActive: true,
      usageCount: 89,
      rating: 4.5
    },
    {
      id: '3',
      name: 'Marketing Campaign Brief',
      description: 'Create a comprehensive marketing campaign brief',
      content: 'Create a marketing campaign brief for {{campaignName}} targeting {{targetAudience}}.\n\nGoals:\n- {{goal1}}\n- {{goal2}}\n- {{goal3}}\n\nKey Messages:\n1. {{message1}}\n2. {{message2}}\n\nChannels: {{channels}}\n\nBudget: {{budget}}\n\nTimeline: {{timeline}}\n\nProvide a detailed strategy and creative recommendations.',
      category: 'marketing',
      tags: ['marketing', 'campaign', 'strategy'],
      variables: [
        { name: 'campaignName', description: 'Campaign name', required: true },
        { name: 'targetAudience', description: 'Target audience', required: true },
        { name: 'goal1', description: 'First goal', required: true },
        { name: 'goal2', description: 'Second goal', required: true },
        { name: 'goal3', description: 'Third goal', required: false },
        { name: 'message1', description: 'First key message', required: true },
        { name: 'message2', description: 'Second key message', required: true },
        { name: 'channels', description: 'Marketing channels', required: true },
        { name: 'budget', description: 'Budget', required: true },
        { name: 'timeline', description: 'Timeline', required: true }
      ],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-19'),
      isActive: false,
      usageCount: 56,
      rating: 4.2
    }
  ]);

  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showVariables, setShowVariables] = useState(false);
  const [testPrompt, setTestPrompt] = useState('');
  const [testResult, setTestResult] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'test'>('browse');

  // Form state for creating/editing
  const [formData, setFormData] = useState<Partial<Prompt>>({
    name: '',
    description: '',
    content: '',
    category: 'general',
    tags: [],
    variables: [],
    isActive: true
  });

  const [newTag, setNewTag] = useState('');
  const [newVariable, setNewVariable] = useState<PromptVariable>({
    name: '',
    description: '',
    required: false
  });

  // Template prompts
  const templates: PromptTemplate[] = [
    {
      id: 't1',
      name: 'Customer Support Response',
      description: 'Professional customer support response template',
      category: 'support',
      icon: '🛟',
      prompt: 'As a customer support agent, respond to the following customer query:\n\nCustomer: {{query}}\n\nProvide a professional, empathetic, and helpful response that addresses their concerns and offers a solution.'
    },
    {
      id: 't2',
      name: 'Product Description Generator',
      description: 'Generate compelling product descriptions',
      category: 'marketing',
      icon: '📝',
      prompt: 'Write a compelling product description for {{productName}}.\n\nProduct Features:\n- {{feature1}}\n- {{feature2}}\n- {{feature3}}\n\nTarget Audience: {{audience}}\n\nTone: {{tone}}\n\nInclude a catchy headline and persuasive copy that highlights benefits.'
    },
    {
      id: 't3',
      name: 'Meeting Summary',
      description: 'Summarize meeting notes and action items',
      category: 'general',
      icon: '📋',
      prompt: 'Summarize the following meeting notes:\n\n{{notes}}\n\nProvide:\n1. Key discussion points\n2. Decisions made\n3. Action items with owners\n4. Next steps\n\nFormat the summary in a clear, professional structure.'
    },
    {
      id: 't4',
      name: 'Code Review Assistant',
      description: 'Review code and provide improvement suggestions',
      category: 'general',
      icon: '💻',
      prompt: 'Review the following code and provide suggestions for improvement:\n\n```{{language}}\n{{code}}\n```\n\nFocus on:\n1. Code quality and best practices\n2. Performance optimization\n3. Security concerns\n4. Readability and maintainability\n5. Potential bugs\n\nProvide specific examples and recommendations.'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Prompts', icon: '📚' },
    { id: 'general', label: 'General', icon: '💬' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'support', label: 'Support', icon: '🛟' },
    { id: 'marketing', label: 'Marketing', icon: '📢' },
    { id: 'custom', label: 'Custom', icon: '✨' }
  ];

  // Filter prompts based on search and category
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get category color
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      general: '#667eea',
      analytics: '#48bb78',
      support: '#fc8181',
      marketing: '#ed8936',
      custom: '#9f7aea'
    };
    return colors[category] || '#667eea';
  };

  // Get category icon
  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      general: '💬',
      analytics: '📊',
      support: '🛟',
      marketing: '📢',
      custom: '✨'
    };
    return icons[category] || '📄';
  };

  // Handle form input changes
  const handleFormChange = (field: keyof Prompt, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  // Add variable
  const addVariable = () => {
    if (newVariable.name.trim()) {
      setFormData(prev => ({
        ...prev,
        variables: [...(prev.variables || []), { ...newVariable }]
      }));
      setNewVariable({ name: '', description: '', required: false });
    }
  };

  // Remove variable
  const removeVariable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variables: prev.variables?.filter((_, i) => i !== index) || []
    }));
  };

  // Save prompt
  const savePrompt = () => {
    if (!formData.name || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    const newPrompt: Prompt = {
      id: Date.now().toString(),
      name: formData.name || '',
      description: formData.description || '',
      content: formData.content || '',
      category: formData.category as Prompt['category'] || 'general',
      tags: formData.tags || [],
      variables: formData.variables || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: formData.isActive !== undefined ? formData.isActive : true,
      usageCount: 0,
      rating: 0
    };

    setPrompts(prev => [newPrompt, ...prev]);
    setIsCreating(false);
    setFormData({
      name: '',
      description: '',
      content: '',
      category: 'general',
      tags: [],
      variables: [],
      isActive: true
    });
  };

  // Test prompt
  const testPromptTemplate = () => {
    if (!testPrompt) {
      alert('Please enter a test prompt');
      return;
    }

    setIsTesting(true);
    setTestResult('');

    // Simulate AI response
    setTimeout(() => {
      const mockResponse = `✅ **Test Results**\n\nYour prompt template was processed successfully!\n\n**Variables detected:** ${testPrompt.match(/\{\{\w+\}\}/g)?.join(', ') || 'None'}\n\n**Preview:**\n${testPrompt.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
        const variable = formData.variables?.find(v => v.name === varName);
        return variable?.defaultValue || `[${varName}]`;
      })}\n\n**Suggestions:**\n• Consider adding more specific context\n• Use clear variable names\n• Test with different variable values`;
      
      setTestResult(mockResponse);
      setIsTesting(false);
    }, 1500);
  };

  // Use template
  const useTemplate = (template: PromptTemplate) => {
    setFormData({
      name: template.name,
      description: template.description,
      content: template.prompt,
      category: template.category as Prompt['category'],
      tags: [template.category, 'template'],
      variables: [],
      isActive: true
    });
    setActiveTab('create');
    setIsCreating(true);
  };

  // Edit prompt
  const editPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setFormData({
      name: prompt.name,
      description: prompt.description,
      content: prompt.content,
      category: prompt.category,
      tags: prompt.tags,
      variables: prompt.variables,
      isActive: prompt.isActive
    });
    setIsEditing(true);
    setActiveTab('create');
  };

  // Update prompt
  const updatePrompt = () => {
    if (!selectedPrompt || !formData.name || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    setPrompts(prev => prev.map(p => 
      p.id === selectedPrompt.id 
        ? { 
            ...p, 
            name: formData.name || p.name,
            description: formData.description || p.description,
            content: formData.content || p.content,
            category: formData.category as Prompt['category'] || p.category,
            tags: formData.tags || p.tags,
            variables: formData.variables || p.variables,
            isActive: formData.isActive !== undefined ? formData.isActive : p.isActive,
            updatedAt: new Date()
          }
        : p
    ));
    setIsEditing(false);
    setSelectedPrompt(null);
    setFormData({
      name: '',
      description: '',
      content: '',
      category: 'general',
      tags: [],
      variables: [],
      isActive: true
    });
  };

  // Delete prompt
  const deletePrompt = (id: string) => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      setPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  // Toggle prompt active status
  const toggleActive = (id: string) => {
    setPrompts(prev => prev.map(p => 
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Render stars for rating
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];
    
    for (let i = 0; i < fullStars; i++) {
      stars.push('⭐');
    }
    if (hasHalfStar) {
      stars.push('🌟');
    }
    if (stars.length === 0) {
      stars.push('☆');
    }
    
    return stars.join(' ');
  };

  return (
    <div className="prompt-management">
      {/* Header */}
      <div className="prompt-header">
        <div className="prompt-header-content">
          <div className="prompt-title-section">
            <h1 className="prompt-title">🧠 Prompt Management</h1>
            <p className="prompt-subtitle">Create, manage, and optimize AI prompts for your assistant</p>
          </div>
          <button 
            className="prompt-create-btn"
            onClick={() => {
              setIsCreating(true);
              setActiveTab('create');
              setFormData({
                name: '',
                description: '',
                content: '',
                category: 'general',
                tags: [],
                variables: [],
                isActive: true
              });
            }}
          >
            <span>+</span> New Prompt
          </button>
        </div>

        {/* Tabs */}
        <div className="prompt-tabs">
          <button
            className={`prompt-tab ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            📚 Browse Prompts
          </button>
          <button
            className={`prompt-tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('create');
              if (!isCreating && !isEditing) {
                setIsCreating(true);
                setFormData({
                  name: '',
                  description: '',
                  content: '',
                  category: 'general',
                  tags: [],
                  variables: [],
                  isActive: true
                });
              }
            }}
          >
            {isEditing ? '✏️ Edit Prompt' : '✨ Create Prompt'}
          </button>
          <button
            className={`prompt-tab ${activeTab === 'test' ? 'active' : ''}`}
            onClick={() => setActiveTab('test')}
          >
            🧪 Test Prompt
          </button>
        </div>
      </div>

      {/* Browse Tab */}
      {activeTab === 'browse' && (
        <div className="prompt-browse">
          {/* Search and Filters */}
          <div className="prompt-filters">
            <div className="search-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search prompts by name, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="filter-group">
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.icon} {category.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                ⊞ Grid
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                ≡ List
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="prompt-stats">
            <div className="stat-item">
              <span className="stat-value">{prompts.length}</span>
              <span className="stat-label">Total Prompts</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{prompts.filter(p => p.isActive).length}</span>
              <span className="stat-label">Active</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{prompts.reduce((sum, p) => sum + p.usageCount, 0)}</span>
              <span className="stat-label">Total Uses</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{Math.round(prompts.reduce((sum, p) => sum + p.rating, 0) / prompts.length * 10) / 10 || 0}⭐</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>

          {/* Prompt Grid/List */}
          <div className={`prompts-container ${viewMode}`}>
            {filteredPrompts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <h3>No prompts found</h3>
                <p>Try adjusting your search or filters, or create a new prompt.</p>
                <button 
                  className="empty-create-btn"
                  onClick={() => {
                    setIsCreating(true);
                    setActiveTab('create');
                  }}
                >
                  Create Your First Prompt
                </button>
              </div>
            ) : (
              filteredPrompts.map(prompt => (
                <div key={prompt.id} className={`prompt-card ${!prompt.isActive ? 'inactive' : ''}`}>
                  <div className="prompt-card-header">
                    <div className="prompt-card-title">
                      <span className="category-badge" style={{ background: getCategoryColor(prompt.category) }}>
                        {getCategoryIcon(prompt.category)}
                      </span>
                      <h3>{prompt.name}</h3>
                    </div>
                    <div className="prompt-card-actions">
                      <button 
                        className="prompt-card-action-btn toggle"
                        onClick={() => toggleActive(prompt.id)}
                        title={prompt.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {prompt.isActive ? '🟢' : '⚪'}
                      </button>
                      <button 
                        className="prompt-card-action-btn"
                        onClick={() => editPrompt(prompt)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button 
                        className="prompt-card-action-btn delete"
                        onClick={() => deletePrompt(prompt.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  <p className="prompt-card-description">{prompt.description}</p>
                  
                  <div className="prompt-card-tags">
                    {prompt.tags.map(tag => (
                      <span key={tag} className="prompt-tag">#{tag}</span>
                    ))}
                  </div>

                  <div className="prompt-card-footer">
                    <div className="prompt-card-meta">
                      <span className="meta-item">📊 {prompt.usageCount} uses</span>
                      <span className="meta-item">{renderStars(prompt.rating)}</span>
                    </div>
                    <span className="prompt-date">Updated {formatDate(prompt.updatedAt)}</span>
                  </div>

                  <div className="prompt-card-preview">
                    <div className="preview-content">
                      {prompt.content.length > 100 ? prompt.content.substring(0, 100) + '...' : prompt.content}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Tab */}
      {(activeTab === 'create' || activeTab === 'browse') && (isCreating || isEditing || activeTab === 'create') && (
        <div className="prompt-create">
          {activeTab === 'create' && (
            <div className="prompt-create-container">
              {/* Templates Section */}
              {isCreating && !isEditing && (
                <div className="templates-section">
                  <h3 className="section-title">🚀 Quick Start Templates</h3>
                  <div className="templates-grid">
                    {templates.map(template => (
                      <div key={template.id} className="template-card">
                        <div className="template-icon">{template.icon}</div>
                        <div className="template-content">
                          <h4>{template.name}</h4>
                          <p>{template.description}</p>
                          <span className="template-category">{template.category}</span>
                        </div>
                        <button 
                          className="use-template-btn"
                          onClick={() => useTemplate(template)}
                        >
                          Use Template
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt Form */}
              <div className="prompt-form">
                <h3 className="section-title">
                  {isEditing ? '✏️ Edit Prompt' : '✨ Create New Prompt'}
                </h3>

                <div className="form-group">
                  <label className="form-label">Prompt Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Customer Support Response"
                    value={formData.name || ''}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Brief description of what this prompt does"
                    value={formData.description || ''}
                    onChange={(e) => handleFormChange('description', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category || 'general'}
                    onChange={(e) => handleFormChange('category', e.target.value)}
                  >
                    <option value="general">💬 General</option>
                    <option value="analytics">📊 Analytics</option>
                    <option value="support">🛟 Support</option>
                    <option value="marketing">📢 Marketing</option>
                    <option value="custom">✨ Custom</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Prompt Content *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Write your prompt template. Use {{variable}} for dynamic content."
                    value={formData.content || ''}
                    onChange={(e) => handleFormChange('content', e.target.value)}
                    rows={8}
                  />
                  <span className="form-hint">
                    💡 Use {'{{variable}}'} syntax for dynamic content. Variables will be highlighted.
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <div className="tag-input-group">
                    <input
                      type="text"
                      className="tag-input"
                      placeholder="Add a tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <button className="add-tag-btn" onClick={addTag}>Add</button>
                  </div>
                  <div className="tags-container">
                    {formData.tags?.map(tag => (
                      <span key={tag} className="form-tag">
                        #{tag}
                        <button className="remove-tag" onClick={() => removeTag(tag)}>×</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Variables</label>
                  <div className="variables-input-group">
                    <input
                      type="text"
                      className="var-input"
                      placeholder="Variable name"
                      value={newVariable.name}
                      onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                    />
                    <input
                      type="text"
                      className="var-input"
                      placeholder="Description"
                      value={newVariable.description}
                      onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                    />
                    <label className="var-required-label">
                      <input
                        type="checkbox"
                        checked={newVariable.required}
                        onChange={(e) => setNewVariable({ ...newVariable, required: e.target.checked })}
                      />
                      Required
                    </label>
                    <button className="add-var-btn" onClick={addVariable}>Add Variable</button>
                  </div>
                  <div className="variables-list">
                    {formData.variables?.map((variable, index) => (
                      <div key={index} className="variable-item">
                        <span className="var-name">{variable.name}</span>
                        <span className="var-desc">{variable.description}</span>
                        <span className={`var-required ${variable.required ? 'required' : 'optional'}`}>
                          {variable.required ? 'Required' : 'Optional'}
                        </span>
                        <button className="remove-var" onClick={() => removeVariable(index)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <input
                      type="checkbox"
                      checked={formData.isActive !== undefined ? formData.isActive : true}
                      onChange={(e) => handleFormChange('isActive', e.target.checked)}
                    />
                    Active
                  </label>
                </div>

                <div className="form-actions">
                  <button 
                    className="form-cancel-btn"
                    onClick={() => {
                      setIsCreating(false);
                      setIsEditing(false);
                      setSelectedPrompt(null);
                      setActiveTab('browse');
                      setFormData({
                        name: '',
                        description: '',
                        content: '',
                        category: 'general',
                        tags: [],
                        variables: [],
                        isActive: true
                      });
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    className="form-submit-btn"
                    onClick={isEditing ? updatePrompt : savePrompt}
                  >
                    {isEditing ? 'Update Prompt' : 'Create Prompt'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Test Tab */}
      {activeTab === 'test' && (
        <div className="prompt-test">
          <div className="test-container">
            <h3 className="section-title">🧪 Test Prompt Template</h3>
            
            <div className="test-form">
              <div className="form-group">
                <label className="form-label">Prompt Template</label>
                <textarea
                  className="form-textarea test-textarea"
                  placeholder="Enter your prompt template with {{variables}} to test..."
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  rows={10}
                />
              </div>

              <div className="test-actions">
                <button 
                  className="test-btn"
                  onClick={testPromptTemplate}
                  disabled={isTesting}
                >
                  {isTesting ? '⏳ Testing...' : '🚀 Test Prompt'}
                </button>
                <button 
                  className="clear-test-btn"
                  onClick={() => {
                    setTestPrompt('');
                    setTestResult('');
                  }}
                >
                  Clear
                </button>
              </div>

              {testResult && (
                <div className="test-result">
                  <div className="result-header">
                    <span className="result-icon">✅</span>
                    <h4>Test Results</h4>
                  </div>
                  <div className="result-content">
                    {testResult.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < testResult.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <div className="test-help">
                <h4>💡 Tips</h4>
                <ul>
                  <li>Use {'{{variableName}}'} for dynamic content</li>
                  <li>Variables will be highlighted in the preview</li>
                  <li>Test different variable values to see variations</li>
                  <li>Save your prompt after testing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptManagementPage;