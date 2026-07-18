"use client"
import React, { useState, useRef } from 'react';
import "../setting.css"

// TypeScript Interfaces
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar: string;
  bio: string;
  company: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
  lastLogin: Date;
}

interface Preferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  dateFormat: string;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
    sound: boolean;
  };
  aiAssistant: {
    autoRespond: boolean;
    responseStyle: 'concise' | 'detailed' | 'balanced';
    language: string;
    tone: 'professional' | 'casual' | 'friendly';
  };
  privacy: {
    showOnlineStatus: boolean;
    shareAnalytics: boolean;
    allowDataCollection: boolean;
  };
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: Date;
  sessions: Session[];
  apiKeys: ApiKey[];
}

interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: Date;
  isCurrent: boolean;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed: Date | null;
  active: boolean;
}

interface NotificationSetting {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
}

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security' | 'notifications' | 'api' | 'team'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sample User Profile
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'Hazrat',
    lastName: 'Usman',
    email: 'hazrat17780@gmail.com',
    username: 'hazrat17780',
    avatar: '',
    bio: 'AI enthusiast and developer passionate about creating intelligent solutions.',
    company: 'AI Solutions Inc.',
    role: 'user',
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date()
  });

  // Sample Preferences
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'light',
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      push: true,
      desktop: true,
      sound: false
    },
    aiAssistant: {
      autoRespond: true,
      responseStyle: 'balanced',
      language: 'en',
      tone: 'professional'
    },
    privacy: {
      showOnlineStatus: true,
      shareAnalytics: false,
      allowDataCollection: true
    }
  });

  // Sample Security Settings
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    lastPasswordChange: new Date('2024-01-15'),
    sessions: [
      {
        id: 's1',
        device: 'MacBook Pro',
        browser: 'Chrome 120',
        ip: '192.168.1.1',
        location: 'New York, USA',
        lastActive: new Date(),
        isCurrent: true
      },
      {
        id: 's2',
        device: 'iPhone 15',
        browser: 'Safari 17',
        ip: '192.168.1.2',
        location: 'New York, USA',
        lastActive: new Date(Date.now() - 3600000 * 2),
        isCurrent: false
      },
      {
        id: 's3',
        device: 'Windows PC',
        browser: 'Firefox 121',
        ip: '192.168.1.3',
        location: 'London, UK',
        lastActive: new Date(Date.now() - 3600000 * 24),
        isCurrent: false
      }
    ],
    apiKeys: [
      {
        id: 'ak1',
        name: 'Production API Key',
        key: 'sk_live_1234567890abcdef',
        createdAt: new Date('2024-01-01'),
        lastUsed: new Date('2024-03-01'),
        active: true
      },
      {
        id: 'ak2',
        name: 'Development API Key',
        key: 'sk_test_abcdef1234567890',
        createdAt: new Date('2024-02-01'),
        lastUsed: null,
        active: true
      }
    ]
  });

  // Sample Notification Settings
  const notificationSettings: NotificationSetting[] = [
    {
      id: 'n1',
      name: 'New Messages',
      description: 'Get notified when you receive new messages',
      enabled: true,
      icon: '💬'
    },
    {
      id: 'n2',
      name: 'AI Responses',
      description: 'Notifications about AI response generation',
      enabled: true,
      icon: '🤖'
    },
    {
      id: 'n3',
      name: 'Team Activity',
      description: 'Updates about team members activities',
      enabled: false,
      icon: '👥'
    },
    {
      id: 'n4',
      name: 'Billing Updates',
      description: 'Invoices, payments, and subscription changes',
      enabled: true,
      icon: '💳'
    },
    {
      id: 'n5',
      name: 'Security Alerts',
      description: 'Suspicious activity and security notifications',
      enabled: true,
      icon: '🔒'
    },
    {
      id: 'n6',
      name: 'Product Updates',
      description: 'New features, improvements, and updates',
      enabled: false,
      icon: '🚀'
    },
    {
      id: 'n7',
      name: 'Weekly Reports',
      description: 'Weekly usage summary and insights',
      enabled: true,
      icon: '📊'
    },
    {
      id: 'n8',
      name: 'Marketing Emails',
      description: 'Tips, news, and promotional offers',
      enabled: false,
      icon: '📧'
    }
  ];

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleProfileUpdate = () => {
    setIsEditing(false);
    // Simulate API call
    alert('Profile updated successfully!');
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPasswordModal(false);
    alert('Password changed successfully!');
  };

  // Handle API key creation
  const handleCreateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    setShowApiKeyModal(false);
    const newKey: ApiKey = {
      id: `ak${Date.now()}`,
      name: 'New API Key',
      key: `sk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date(),
      lastUsed: null,
      active: true
    };
    setSecurity({
      ...security,
      apiKeys: [...security.apiKeys, newKey]
    });
    alert('API Key created successfully!');
  };

  // Handle API key deletion
  const handleDeleteApiKey = (id: string) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      setSecurity({
        ...security,
        apiKeys: security.apiKeys.filter(key => key.id !== id)
      });
    }
  };

  // Handle API key toggle
  const handleToggleApiKey = (id: string) => {
    setSecurity({
      ...security,
      apiKeys: security.apiKeys.map(key => 
        key.id === id ? { ...key, active: !key.active } : key
      )
    });
  };

  // Handle session logout
  const handleLogoutSession = (id: string) => {
    if (window.confirm('Are you sure you want to log out this session?')) {
      setSecurity({
        ...security,
        sessions: security.sessions.filter(session => session.id !== id)
      });
    }
  };

  // Handle two-factor setup
  const handleTwoFactorSetup = () => {
    setShowTwoFactorModal(false);
    setSecurity({
      ...security,
      twoFactorEnabled: !security.twoFactorEnabled
    });
  };

  // Handle notification toggle
  const handleNotificationToggle = (id: string) => {
    // In a real app, update the notification settings
    console.log(`Toggled notification ${id}`);
  };

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get initials
  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // Mask API key
  const maskApiKey = (key: string): string => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
  };

  return (
    <div className="settings-page">
      {/* Header */}
      <div className="settings-header">
        <div className="settings-header-content">
          <div className="settings-title-section">
            <h1 className="settings-title">⚙️ Settings</h1>
            <p className="settings-subtitle">Manage your account preferences and security</p>
          </div>
          <div className="settings-header-actions">
            <button className="settings-action-btn" onClick={() => setIsEditing(true)}>
              <span>✏️</span> Edit Profile
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="settings-tabs">
          <button
            className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button
            className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            🎨 Preferences
          </button>
          <button
            className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
          <button
            className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            🔔 Notifications
          </button>
          <button
            className={`settings-tab ${activeTab === 'api' ? 'active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            🔑 API Keys
          </button>
          <button
            className={`settings-tab ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            👥 Team
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="profile-tab">
          <div className="settings-card">
            <div className="profile-header">
              <div className="profile-avatar-section">
                <div className="profile-avatar-wrapper">
                  {imagePreview || profile.avatar ? (
                    <img 
                      src={imagePreview || profile.avatar} 
                      alt="Profile" 
                      className="profile-avatar"
                    />
                  ) : (
                    <div className="profile-avatar-placeholder">
                      {getInitials(profile.firstName, profile.lastName)}
                    </div>
                  )}
                  <button 
                    className="avatar-upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📷
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </div>
                <div className="profile-name-section">
                  <h2>{profile.firstName} {profile.lastName}</h2>
                  <span className="profile-role">{profile.role}</span>
                </div>
              </div>
              <div className="profile-status">
                <span className="status-dot online"></span>
                <span className="status-text">Online</span>
                <span className="status-time">Last active: {formatTime(profile.lastLogin)}</span>
              </div>
            </div>

            <div className="profile-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    className="form-input"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className="btn-save" onClick={handleProfileUpdate}>
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <div className="profile-account-info">
              <div className="info-item">
                <span className="info-label">Account Created</span>
                <span className="info-value">{formatDate(profile.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">{formatDate(profile.createdAt)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Status</span>
                <span className="info-value verified">✅ Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="preferences-tab">
          <div className="settings-card">
            <h3 className="section-title">🎨 Appearance</h3>
            <div className="preference-group">
              <div className="preference-item">
                <span className="preference-label">Theme</span>
                <div className="theme-selector">
                  <button
                    className={`theme-btn ${preferences.theme === 'light' ? 'active' : ''}`}
                    onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                  >
                    ☀️ Light
                  </button>
                  <button
                    className={`theme-btn ${preferences.theme === 'dark' ? 'active' : ''}`}
                    onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                  >
                    🌙 Dark
                  </button>
                  <button
                    className={`theme-btn ${preferences.theme === 'system' ? 'active' : ''}`}
                    onClick={() => setPreferences({ ...preferences, theme: 'system' })}
                  >
                    💻 System
                  </button>
                </div>
              </div>

              <div className="preference-item">
                <span className="preference-label">Language</span>
                <select
                  className="form-select"
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="es">🇪🇸 Spanish</option>
                  <option value="fr">🇫🇷 French</option>
                  <option value="de">🇩🇪 German</option>
                  <option value="ja">🇯🇵 Japanese</option>
                  <option value="zh">🇨🇳 Chinese</option>
                </select>
              </div>

              <div className="preference-item">
                <span className="preference-label">Timezone</span>
                <select
                  className="form-select"
                  value={preferences.timezone}
                  onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                >
                  <option value="America/New_York">🌎 Eastern Time (ET)</option>
                  <option value="America/Chicago">🌎 Central Time (CT)</option>
                  <option value="America/Denver">🌎 Mountain Time (MT)</option>
                  <option value="America/Los_Angeles">🌎 Pacific Time (PT)</option>
                  <option value="Europe/London">🌎 London (GMT)</option>
                  <option value="Europe/Paris">🌎 Central European (CET)</option>
                  <option value="Asia/Dubai">🌎 Dubai (GST)</option>
                  <option value="Asia/Tokyo">🌎 Tokyo (JST)</option>
                </select>
              </div>
            </div>

            <h3 className="section-title">🤖 AI Assistant</h3>
            <div className="preference-group">
              <div className="preference-item">
                <span className="preference-label">Response Style</span>
                <div className="style-selector">
                  <button
                    className={`style-btn ${preferences.aiAssistant.responseStyle === 'concise' ? 'active' : ''}`}
                    onClick={() => setPreferences({
                      ...preferences,
                      aiAssistant: { ...preferences.aiAssistant, responseStyle: 'concise' }
                    })}
                  >
                    Concise
                  </button>
                  <button
                    className={`style-btn ${preferences.aiAssistant.responseStyle === 'balanced' ? 'active' : ''}`}
                    onClick={() => setPreferences({
                      ...preferences,
                      aiAssistant: { ...preferences.aiAssistant, responseStyle: 'balanced' }
                    })}
                  >
                    Balanced
                  </button>
                  <button
                    className={`style-btn ${preferences.aiAssistant.responseStyle === 'detailed' ? 'active' : ''}`}
                    onClick={() => setPreferences({
                      ...preferences,
                      aiAssistant: { ...preferences.aiAssistant, responseStyle: 'detailed' }
                    })}
                  >
                    Detailed
                  </button>
                </div>
              </div>

              <div className="preference-item">
                <span className="preference-label">Tone</span>
                <select
                  className="form-select"
                  value={preferences.aiAssistant.tone}
                  onChange={(e) => setPreferences({
                    ...preferences,
                    aiAssistant: { ...preferences.aiAssistant, tone: e.target.value as 'professional' | 'casual' | 'friendly' }
                  })}
                >
                  <option value="professional">💼 Professional</option>
                  <option value="casual">😊 Casual</option>
                  <option value="friendly">🤝 Friendly</option>
                </select>
              </div>

              <div className="preference-item toggle-item">
                <span className="preference-label">Auto-Respond</span>
                <button
                  className={`toggle-switch ${preferences.aiAssistant.autoRespond ? 'active' : ''}`}
                  onClick={() => setPreferences({
                    ...preferences,
                    aiAssistant: { ...preferences.aiAssistant, autoRespond: !preferences.aiAssistant.autoRespond }
                  })}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
            </div>

            <h3 className="section-title">🔒 Privacy</h3>
            <div className="preference-group">
              <div className="preference-item toggle-item">
                <span className="preference-label">Show Online Status</span>
                <button
                  className={`toggle-switch ${preferences.privacy.showOnlineStatus ? 'active' : ''}`}
                  onClick={() => setPreferences({
                    ...preferences,
                    privacy: { ...preferences.privacy, showOnlineStatus: !preferences.privacy.showOnlineStatus }
                  })}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>

              <div className="preference-item toggle-item">
                <span className="preference-label">Share Analytics</span>
                <button
                  className={`toggle-switch ${preferences.privacy.shareAnalytics ? 'active' : ''}`}
                  onClick={() => setPreferences({
                    ...preferences,
                    privacy: { ...preferences.privacy, shareAnalytics: !preferences.privacy.shareAnalytics }
                  })}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>

              <div className="preference-item toggle-item">
                <span className="preference-label">Allow Data Collection</span>
                <button
                  className={`toggle-switch ${preferences.privacy.allowDataCollection ? 'active' : ''}`}
                  onClick={() => setPreferences({
                    ...preferences,
                    privacy: { ...preferences.privacy, allowDataCollection: !preferences.privacy.allowDataCollection }
                  })}
                >
                  <span className="toggle-slider"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="security-tab">
          <div className="settings-card">
            <h3 className="section-title">🔐 Security Settings</h3>
            
            <div className="security-item">
              <div className="security-info">
                <div className="security-icon">🔑</div>
                <div className="security-content">
                  <h4>Password</h4>
                  <p>Last changed {formatDate(security.lastPasswordChange)}</p>
                </div>
              </div>
              <button className="security-action-btn" onClick={() => setShowPasswordModal(true)}>
                Change Password
              </button>
            </div>

            <div className="security-item">
              <div className="security-info">
                <div className="security-icon">📱</div>
                <div className="security-content">
                  <h4>Two-Factor Authentication</h4>
                  <p>{security.twoFactorEnabled ? '✅ Enabled' : '❌ Disabled'}</p>
                </div>
              </div>
              <button className="security-action-btn" onClick={() => setShowTwoFactorModal(true)}>
                {security.twoFactorEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>

            <div className="security-item">
              <div className="security-info">
                <div className="security-icon">📊</div>
                <div className="security-content">
                  <h4>Data Export</h4>
                  <p>Download all your data and activity logs</p>
                </div>
              </div>
              <button className="security-action-btn">
                Export Data
              </button>
            </div>

            <div className="security-item">
              <div className="security-info">
                <div className="security-icon">🗑️</div>
                <div className="security-content">
                  <h4>Delete Account</h4>
                  <p className="danger">Permanently delete your account and all data</p>
                </div>
              </div>
              <button className="security-action-btn danger">
                Delete Account
              </button>
            </div>

            <h3 className="section-title" style={{ marginTop: '32px' }}>💻 Active Sessions</h3>
            <div className="sessions-list">
              {security.sessions.map(session => (
                <div key={session.id} className={`session-item ${session.isCurrent ? 'current' : ''}`}>
                  <div className="session-info">
                    <div className="session-icon">
                      {session.device.includes('Mac') ? '💻' : 
                       session.device.includes('iPhone') ? '📱' : 
                       session.device.includes('Windows') ? '🖥️' : '📱'}
                    </div>
                    <div className="session-details">
                      <h4>{session.device}</h4>
                      <p>{session.browser} • {session.ip}</p>
                      <p className="session-location">{session.location}</p>
                      <span className="session-time">Last active: {formatTime(session.lastActive)}</span>
                    </div>
                  </div>
                  <div className="session-actions">
                    {session.isCurrent && <span className="current-session-badge">Current</span>}
                    <button 
                      className="session-logout-btn"
                      onClick={() => handleLogoutSession(session.id)}
                      disabled={session.isCurrent}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="notifications-tab">
          <div className="settings-card">
            <h3 className="section-title">🔔 Notification Preferences</h3>
            
            <div className="notification-preferences">
              <div className="notification-category">
                <h4>General Notifications</h4>
                <div className="notification-settings-list">
                  {notificationSettings.slice(0, 4).map(setting => (
                    <div key={setting.id} className="notification-setting-item">
                      <div className="notification-info">
                        <span className="notification-icon">{setting.icon}</span>
                        <div className="notification-content">
                          <span className="notification-name">{setting.name}</span>
                          <span className="notification-description">{setting.description}</span>
                        </div>
                      </div>
                      <button
                        className={`toggle-switch ${setting.enabled ? 'active' : ''}`}
                        onClick={() => handleNotificationToggle(setting.id)}
                      >
                        <span className="toggle-slider"></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="notification-category">
                <h4>System Notifications</h4>
                <div className="notification-settings-list">
                  {notificationSettings.slice(4).map(setting => (
                    <div key={setting.id} className="notification-setting-item">
                      <div className="notification-info">
                        <span className="notification-icon">{setting.icon}</span>
                        <div className="notification-content">
                          <span className="notification-name">{setting.name}</span>
                          <span className="notification-description">{setting.description}</span>
                        </div>
                      </div>
                      <button
                        className={`toggle-switch ${setting.enabled ? 'active' : ''}`}
                        onClick={() => handleNotificationToggle(setting.id)}
                      >
                        <span className="toggle-slider"></span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="notification-channels">
                <h4>Notification Channels</h4>
                <div className="channels-grid">
                  <div className="channel-item">
                    <span className="channel-icon">📧</span>
                    <span className="channel-name">Email</span>
                    <button
                      className={`toggle-switch ${preferences.notifications.email ? 'active' : ''}`}
                      onClick={() => setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, email: !preferences.notifications.email }
                      })}
                    >
                      <span className="toggle-slider"></span>
                    </button>
                  </div>
                  <div className="channel-item">
                    <span className="channel-icon">📱</span>
                    <span className="channel-name">Push</span>
                    <button
                      className={`toggle-switch ${preferences.notifications.push ? 'active' : ''}`}
                      onClick={() => setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, push: !preferences.notifications.push }
                      })}
                    >
                      <span className="toggle-slider"></span>
                    </button>
                  </div>
                  <div className="channel-item">
                    <span className="channel-icon">💻</span>
                    <span className="channel-name">Desktop</span>
                    <button
                      className={`toggle-switch ${preferences.notifications.desktop ? 'active' : ''}`}
                      onClick={() => setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, desktop: !preferences.notifications.desktop }
                      })}
                    >
                      <span className="toggle-slider"></span>
                    </button>
                  </div>
                  <div className="channel-item">
                    <span className="channel-icon">🔊</span>
                    <span className="channel-name">Sound</span>
                    <button
                      className={`toggle-switch ${preferences.notifications.sound ? 'active' : ''}`}
                      onClick={() => setPreferences({
                        ...preferences,
                        notifications: { ...preferences.notifications, sound: !preferences.notifications.sound }
                      })}
                    >
                      <span className="toggle-slider"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Keys Tab */}
      {activeTab === 'api' && (
        <div className="api-tab">
          <div className="settings-card">
            <div className="api-header">
              <h3 className="section-title">🔑 API Keys</h3>
              <button className="add-api-btn" onClick={() => setShowApiKeyModal(true)}>
                + Create API Key
              </button>
            </div>

            <div className="api-keys-list">
              {security.apiKeys.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">🔑</span>
                  <p>No API keys created yet</p>
                  <button className="empty-create-btn" onClick={() => setShowApiKeyModal(true)}>
                    Create your first API key
                  </button>
                </div>
              ) : (
                security.apiKeys.map(key => (
                  <div key={key.id} className={`api-key-item ${!key.active ? 'inactive' : ''}`}>
                    <div className="api-key-info">
                      <div className="api-key-name">{key.name}</div>
                      <div className="api-key-details">
                        <code className="api-key-value">{maskApiKey(key.key)}</code>
                        <span className="api-key-date">
                          Created: {formatDate(key.createdAt)}
                        </span>
                        {key.lastUsed && (
                          <span className="api-key-date">
                            Last used: {formatDate(key.lastUsed)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="api-key-actions">
                      <span className={`api-key-status ${key.active ? 'active' : 'inactive'}`}>
                        {key.active ? 'Active' : 'Inactive'}
                      </span>
                      <button 
                        className="api-action-btn"
                        onClick={() => handleToggleApiKey(key.id)}
                      >
                        {key.active ? 'Disable' : 'Enable'}
                      </button>
                      <button 
                        className="api-action-btn copy"
                        onClick={() => {
                          navigator.clipboard.writeText(key.key);
                          alert('API key copied to clipboard!');
                        }}
                      >
                        Copy
                      </button>
                      <button 
                        className="api-action-btn delete"
                        onClick={() => handleDeleteApiKey(key.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="api-docs">
              <h4>📖 API Documentation</h4>
              <p>Learn how to use your API keys to integrate with our services.</p>
              <button className="docs-btn">View Documentation →</button>
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <div className="team-tab">
          <div className="settings-card">
            <div className="team-header">
              <h3 className="section-title">👥 Team Members</h3>
              <button className="add-team-btn">+ Invite Member</button>
            </div>

            <div className="team-members-list">
              {[
                { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', avatar: 'JD', status: 'online' },
                { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'Developer', avatar: 'SS', status: 'online' },
                { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Designer', avatar: 'MJ', status: 'offline' },
                { id: '4', name: 'Emily Davis', email: 'emily@example.com', role: 'Developer', avatar: 'ED', status: 'away' },
              ].map(member => (
                <div key={member.id} className="team-member-item">
                  <div className="team-member-info">
                    <div className="team-member-avatar">
                      {member.avatar}
                      <span className={`member-status ${member.status}`}></span>
                    </div>
                    <div className="team-member-details">
                      <h4>{member.name}</h4>
                      <p>{member.email}</p>
                      <span className="team-member-role">{member.role}</span>
                    </div>
                  </div>
                  <div className="team-member-actions">
                    <button className="team-action-btn">✏️ Edit</button>
                    <button className="team-action-btn danger">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="team-settings">
              <h4>Team Settings</h4>
              <div className="team-setting-item">
                <div className="team-setting-info">
                  <span>Allow member invitations</span>
                  <p>Members can invite new team members</p>
                </div>
                <button className="toggle-switch active">
                  <span className="toggle-slider"></span>
                </button>
              </div>
              <div className="team-setting-item">
                <div className="team-setting-info">
                  <span>Require approval for new members</span>
                  <p>Admins must approve new member requests</p>
                </div>
                <button className="toggle-switch">
                  <span className="toggle-slider"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Change Password</h3>
              <button className="modal-close" onClick={() => setShowPasswordModal(false)}>✕</button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" required />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" required />
                  <span className="form-hint">Must be at least 8 characters</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-cancel" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-confirm">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {showTwoFactorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{security.twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication</h3>
              <button className="modal-close" onClick={() => setShowTwoFactorModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="two-factor-info">
                <div className="qr-code-placeholder">
                  <span>📱</span>
                  <p>Scan QR code with authenticator app</p>
                </div>
                <p className="two-factor-description">
                  {security.twoFactorEnabled 
                    ? 'Disabling 2FA will make your account less secure. Are you sure?' 
                    : 'Enable 2FA to add an extra layer of security to your account.'}
                </p>
                {!security.twoFactorEnabled && (
                  <div className="form-group">
                    <label className="form-label">Enter backup code</label>
                    <input type="text" className="form-input" placeholder="6-digit code" />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowTwoFactorModal(false)}>
                Cancel
              </button>
              <button className="modal-confirm" onClick={handleTwoFactorSetup}>
                {security.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {showApiKeyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create API Key</h3>
              <button className="modal-close" onClick={() => setShowApiKeyModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateApiKey}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Key Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g., Production API Key"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Permissions</label>
                  <div className="permissions-checkboxes">
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked /> Read
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked /> Write
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" /> Delete
                    </label>
                    <label className="checkbox-label">
                      <input type="checkbox" defaultChecked /> Manage
                    </label>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Expiration</label>
                  <select className="form-select">
                    <option value="never">Never</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="modal-cancel" onClick={() => setShowApiKeyModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="modal-confirm">
                  Create API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;