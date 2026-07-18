"use client"
// AnalyticsPage.tsx
import React, { useState, useEffect } from 'react';
import "../../../../public/analytics.css"

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

interface MetricData {
  label: string;
  value: number | string;
  change: number;
  icon: string;
  color: string;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
  }[];
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

interface AnalyticsProps {
  user?: User;
}

// Sample data
const sampleUser: User = {
  id: "6a54cf1073bd4e0ee941beb3",
  firstName: "Hazrat",
  lastName: "usman",
  email: "hazrat17780@gmail.com",
  username: "hazrat17780",
  emailVerified: true,
  role: "user"
};

const AnalyticsPage: React.FC<AnalyticsProps> = ({ user = sampleUser }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'engagement'>('overview');

  // Mock metrics data
  const metrics: MetricData[] = [
    { label: 'Total Users', value: '12,847', change: 12.5, icon: '👥', color: '#667eea' },
    { label: 'Active Sessions', value: '3,421', change: 8.3, icon: '🟢', color: '#48bb78' },
    { label: 'Revenue', value: '$48,293', change: 23.1, icon: '💰', color: '#ed8936' },
    { label: 'Conversion Rate', value: '3.42%', change: -2.1, icon: '📊', color: '#9f7aea' },
  ];

  // Mock chart data - User Growth
  const userGrowthData: ChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'New Users',
        data: [120, 150, 180, 140, 200, 170, 220],
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: '#667eea',
        fill: true,
      },
      {
        label: 'Active Users',
        data: [800, 850, 900, 820, 950, 880, 1020],
        backgroundColor: 'rgba(72, 187, 120, 0.2)',
        borderColor: '#48bb78',
        fill: true,
      }
    ]
  };

  // Mock chart data - Revenue
  const revenueData: ChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [28000, 32000, 35000, 38000, 42000, 48293],
        backgroundColor: 'rgba(237, 137, 54, 0.2)',
        borderColor: '#ed8936',
        fill: true,
      }
    ]
  };

  // Mock activity data
  const recentActivities: ActivityItem[] = [
    { id: '1', user: 'John Doe', action: 'Signed up', timestamp: '2 mins ago', status: 'success' },
    { id: '2', user: 'Jane Smith', action: 'Completed purchase', timestamp: '15 mins ago', status: 'success' },
    { id: '3', user: 'Bob Johnson', action: 'Updated profile', timestamp: '1 hour ago', status: 'pending' },
    { id: '4', user: 'Alice Brown', action: 'Logged in', timestamp: '2 hours ago', status: 'success' },
    { id: '5', user: 'Charlie Wilson', action: 'Failed payment', timestamp: '3 hours ago', status: 'failed' },
  ];

  // Top countries data
  const topCountries = [
    { country: 'United States', users: 4250, percentage: 33.1 },
    { country: 'United Kingdom', users: 2150, percentage: 16.7 },
    { country: 'Germany', users: 1800, percentage: 14.0 },
    { country: 'France', users: 1200, percentage: 9.3 },
    { country: 'Canada', users: 950, percentage: 7.4 },
  ];

  // Device distribution
  const deviceData = [
    { device: 'Desktop', percentage: 45, color: '#667eea' },
    { device: 'Mobile', percentage: 35, color: '#48bb78' },
    { device: 'Tablet', percentage: 20, color: '#ed8936' },
  ];

  // Simulate real-time updates
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Render simple bar chart (since we can't use actual chart libraries in this example)
  const renderSimpleChart = (data: ChartData, height: number = 200) => {
    const maxValue = Math.max(...data.datasets.flatMap(d => d.data));
    
    return (
      <div className="simple-chart" style={{ height: `${height}px` }}>
        {data.datasets.map((dataset, datasetIndex) => (
          <div key={datasetIndex} className="chart-dataset">
            {dataset.data.map((value, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div 
                  className="chart-bar"
                  style={{
                    height: `${(value / maxValue) * 100}%`,
                    backgroundColor: dataset.borderColor || '#667eea',
                    opacity: 0.8,
                  }}
                  title={`${dataset.label}: ${value}`}
                />
                <span className="chart-label">{data.labels[index]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="analytics-container">
      {/* Header */}
      <div className="analytics-header">
        <div className="header-left">
          <h1 className="analytics-title">📊 Analytics Dashboard</h1>
          <p className="analytics-subtitle">
            Welcome back, {user.firstName}! Here's what's happening with your platform.
          </p>
        </div>
        <div className="header-right">
          <div className="time-range-selector">
            <button 
              className={`time-btn ${selectedTimeRange === '7d' ? 'active' : ''}`}
              onClick={() => setSelectedTimeRange('7d')}
            >
              7 Days
            </button>
            <button 
              className={`time-btn ${selectedTimeRange === '30d' ? 'active' : ''}`}
              onClick={() => setSelectedTimeRange('30d')}
            >
              30 Days
            </button>
            <button 
              className={`time-btn ${selectedTimeRange === '90d' ? 'active' : ''}`}
              onClick={() => setSelectedTimeRange('90d')}
            >
              90 Days
            </button>
          </div>
          <div className="last-updated">
            <span>🔄 Updated: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-icon" style={{ backgroundColor: metric.color + '20', color: metric.color }}>
              {metric.icon}
            </div>
            <div className="metric-content">
              <span className="metric-label">{metric.label}</span>
              <span className="metric-value">{metric.value}</span>
              <span className={`metric-change ${metric.change >= 0 ? 'positive' : 'negative'}`}>
                {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="analytics-tabs">
        {['overview', 'users', 'revenue', 'engagement'].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card large">
          <div className="chart-header">
            <h3>User Growth</h3>
            <span className="chart-subtitle">Last 7 days</span>
          </div>
          <div className="chart-body">
            {renderSimpleChart(userGrowthData)}
          </div>
          <div className="chart-legend">
            {userGrowthData.datasets.map((dataset, index) => (
              <span key={index} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: dataset.borderColor as string }}></span>
                {dataset.label}
              </span>
            ))}
          </div>
        </div>

        <div className="chart-card medium">
          <div className="chart-header">
            <h3>Revenue</h3>
            <span className="chart-subtitle">Monthly trend</span>
          </div>
          <div className="chart-body">
            {renderSimpleChart(revenueData, 150)}
          </div>
        </div>

        <div className="chart-card small">
          <div className="chart-header">
            <h3>Devices</h3>
            <span className="chart-subtitle">Distribution</span>
          </div>
          <div className="device-distribution">
            {deviceData.map((device, index) => (
              <div key={index} className="device-item">
                <div className="device-info">
                  <span className="device-name">{device.device}</span>
                  <span className="device-percentage">{device.percentage}%</span>
                </div>
                <div className="device-bar-bg">
                  <div 
                    className="device-bar-fill" 
                    style={{ 
                      width: `${device.percentage}%`,
                      backgroundColor: device.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-grid">
        {/* Recent Activity */}
        <div className="activity-card">
          <div className="card-header">
            <h3>🕐 Recent Activity</h3>
            <button className="view-all-btn">View All</button>
          </div>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className="activity-user">
                  <div className="user-avatar">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="activity-details">
                    <span className="activity-name">{activity.user}</span>
                    <span className="activity-action">{activity.action}</span>
                  </div>
                </div>
                <div className="activity-right">
                  <span className={`activity-status ${activity.status}`}>
                    {activity.status === 'success' && '✅'}
                    {activity.status === 'pending' && '⏳'}
                    {activity.status === 'failed' && '❌'}
                  </span>
                  <span className="activity-time">{activity.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="countries-card">
          <div className="card-header">
            <h3>🌍 Top Countries</h3>
            <span className="total-users">{topCountries.reduce((sum, c) => sum + c.users, 0).toLocaleString()} total</span>
          </div>
          <div className="countries-list">
            {topCountries.map((country, index) => (
              <div key={index} className="country-item">
                <div className="country-info">
                  <span className="country-name">{country.country}</span>
                  <span className="country-users">{country.users.toLocaleString()} users</span>
                </div>
                <div className="country-bar-bg">
                  <div 
                    className="country-bar-fill" 
                    style={{ 
                      width: `${country.percentage}%`,
                      background: `linear-gradient(90deg, #667eea, #764ba2)`
                    }}
                  />
                </div>
                <span className="country-percentage">{country.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Profile Summary */}
      <div className="profile-summary">
        <div className="profile-summary-content">
          <div className="summary-item">
            <span className="summary-label">Logged in as</span>
            <span className="summary-value">{user.firstName} {user.lastName}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Role</span>
            <span className="summary-value role-badge">{user.role}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Email Status</span>
            <span className={`summary-value ${user.emailVerified ? 'verified' : 'unverified'}`}>
              {user.emailVerified ? '✅ Verified' : '❌ Unverified'}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">User ID</span>
            <span className="summary-value id-text">{user.id.slice(0, 8)}...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;