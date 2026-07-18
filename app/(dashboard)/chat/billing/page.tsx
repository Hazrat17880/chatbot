"use client"
import React, { useState, useEffect } from 'react';
import "../billing.css"

// TypeScript Interfaces
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  limits: {
    users: number;
    prompts: number;
    storage: number;
    apiCalls: number;
  };
  popular?: boolean;
  discount?: number;
}

interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'pending';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethodId: string;
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryDate?: string;
  isDefault: boolean;
  name: string;
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue' | 'refunded';
  date: Date;
  dueDate: Date;
  description: string;
  items: InvoiceItem[];
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Usage {
  date: Date;
  apiCalls: number;
  promptsUsed: number;
  usersActive: number;
  storageUsed: number;
}

const BillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'subscription' | 'payment' | 'invoices' | 'usage'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Sample Plans
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      currency: 'USD',
      interval: 'monthly',
      features: [
        '100 prompts per month',
        '1 user account',
        'Basic analytics',
        'Community support'
      ],
      limits: {
        users: 1,
        prompts: 100,
        storage: 100,
        apiCalls: 1000
      }
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For growing businesses',
      price: 29,
      currency: 'USD',
      interval: 'monthly',
      features: [
        'Unlimited prompts',
        '5 user accounts',
        'Advanced analytics',
        'Priority support',
        'Custom templates',
        'API access'
      ],
      limits: {
        users: 5,
        prompts: -1,
        storage: 1000,
        apiCalls: 50000
      },
      popular: true
    },
    {
      id: 'business',
      name: 'Business',
      description: 'For large organizations',
      price: 99,
      currency: 'USD',
      interval: 'monthly',
      features: [
        'Unlimited prompts',
        'Unlimited users',
        'Advanced analytics + AI insights',
        '24/7 priority support',
        'Custom templates & branding',
        'API access + webhooks',
        'SSO & SAML',
        'Dedicated account manager'
      ],
      limits: {
        users: -1,
        prompts: -1,
        storage: 5000,
        apiCalls: 500000
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom solution for your needs',
      price: 299,
      currency: 'USD',
      interval: 'monthly',
      features: [
        'Everything in Business',
        'Custom AI models',
        'On-premise deployment',
        'SLA guarantee',
        'Custom integrations',
        'Training & onboarding',
        'Dedicated infrastructure'
      ],
      limits: {
        users: -1,
        prompts: -1,
        storage: 10000,
        apiCalls: -1
      }
    }
  ];

  // Sample Current Subscription
  const [subscription, setSubscription] = useState<Subscription>({
    id: 'sub_123',
    planId: 'pro',
    status: 'active',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    autoRenew: true,
    paymentMethodId: 'pm_123'
  });

  // Sample Payment Methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_123',
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa',
      expiryDate: '12/26',
      isDefault: true,
      name: 'John Doe'
    },
    {
      id: 'pm_456',
      type: 'credit_card',
      last4: '8888',
      brand: 'Mastercard',
      expiryDate: '08/25',
      isDefault: false,
      name: 'Jane Smith'
    }
  ]);

  // Sample Invoices
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 'inv_001',
      number: 'INV-2024-001',
      amount: 29,
      currency: 'USD',
      status: 'paid',
      date: new Date('2024-01-01'),
      dueDate: new Date('2024-01-15'),
      description: 'Pro Plan - January 2024',
      items: [
        {
          description: 'Pro Plan Subscription',
          quantity: 1,
          unitPrice: 29,
          total: 29
        }
      ]
    },
    {
      id: 'inv_002',
      number: 'INV-2024-002',
      amount: 29,
      currency: 'USD',
      status: 'paid',
      date: new Date('2024-02-01'),
      dueDate: new Date('2024-02-15'),
      description: 'Pro Plan - February 2024',
      items: [
        {
          description: 'Pro Plan Subscription',
          quantity: 1,
          unitPrice: 29,
          total: 29
        }
      ]
    },
    {
      id: 'inv_003',
      number: 'INV-2024-003',
      amount: 29,
      currency: 'USD',
      status: 'pending',
      date: new Date('2024-03-01'),
      dueDate: new Date('2024-03-15'),
      description: 'Pro Plan - March 2024',
      items: [
        {
          description: 'Pro Plan Subscription',
          quantity: 1,
          unitPrice: 29,
          total: 29
        }
      ]
    }
  ]);

  // Sample Usage Data
  const [usageData] = useState<Usage[]>([
    { date: new Date('2024-03-01'), apiCalls: 1234, promptsUsed: 56, usersActive: 12, storageUsed: 256 },
    { date: new Date('2024-03-02'), apiCalls: 1456, promptsUsed: 67, usersActive: 14, storageUsed: 280 },
    { date: new Date('2024-03-03'), apiCalls: 1678, promptsUsed: 78, usersActive: 16, storageUsed: 310 },
    { date: new Date('2024-03-04'), apiCalls: 1890, promptsUsed: 89, usersActive: 18, storageUsed: 340 },
    { date: new Date('2024-03-05'), apiCalls: 2100, promptsUsed: 95, usersActive: 20, storageUsed: 370 },
    { date: new Date('2024-03-06'), apiCalls: 2300, promptsUsed: 100, usersActive: 22, storageUsed: 400 },
    { date: new Date('2024-03-07'), apiCalls: 2500, promptsUsed: 110, usersActive: 24, storageUsed: 430 }
  ]);

  // Get current plan details
  const currentPlan = plans.find(p => p.id === subscription.planId);

  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  // Handle subscription change
  const handleSubscriptionChange = async () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      if (selectedPlan) {
        setSubscription({
          ...subscription,
          planId: selectedPlan,
          startDate: new Date(),
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        });
        setShowPaymentModal(false);
        setSelectedPlan(null);
      }
      setIsProcessing(false);
    }, 1500);
  };

  // Handle auto-renew toggle
  const toggleAutoRenew = () => {
    setSubscription({
      ...subscription,
      autoRenew: !subscription.autoRenew
    });
  };

  // Handle cancel subscription
  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription?')) {
      setSubscription({
        ...subscription,
        status: 'canceled'
      });
    }
  };

  // Handle payment method removal
  const removePaymentMethod = (id: string) => {
    if (paymentMethods.length > 1) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
    } else {
      alert('You need at least one payment method.');
    }
  };

  // Handle set default payment method
  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Format date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      active: '#48bb78',
      canceled: '#fc8181',
      expired: '#ed8936',
      pending: '#f6ad55',
      paid: '#48bb78',
      overdue: '#fc8181',
      refunded: '#9f7aea'
    };
    return colors[status] || '#a0aec0';
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string): string => {
    const colors: Record<string, string> = {
      active: '#d1fae5',
      canceled: '#fee2e2',
      expired: '#feebc8',
      pending: '#fef3c7',
      paid: '#d1fae5',
      overdue: '#fee2e2',
      refunded: '#ede9fe'
    };
    return colors[status] || '#f3f4f6';
  };

  // Calculate total usage
  const totalUsage = usageData.reduce((acc, curr) => ({
    apiCalls: acc.apiCalls + curr.apiCalls,
    promptsUsed: acc.promptsUsed + curr.promptsUsed,
    usersActive: Math.max(acc.usersActive, curr.usersActive),
    storageUsed: acc.storageUsed + curr.storageUsed
  }), { apiCalls: 0, promptsUsed: 0, usersActive: 0, storageUsed: 0 });

  return (
    <div className="billing-page">
      {/* Header */}
      <div className="billing-header">
        <div className="billing-header-content">
          <div className="billing-title-section">
            <h1 className="billing-title">💳 Billing & Subscription</h1>
            <p className="billing-subtitle">Manage your subscription, payment methods, and billing history</p>
          </div>
          <div className="billing-header-actions">
            <button className="billing-action-btn">
              <span>📊</span> Export Data
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="billing-tabs">
          <button
            className={`billing-tab ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
          >
            📋 Plans
          </button>
          <button
            className={`billing-tab ${activeTab === 'subscription' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscription')}
          >
            📝 Subscription
          </button>
          <button
            className={`billing-tab ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            💳 Payment Methods
          </button>
          <button
            className={`billing-tab ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            📄 Invoices
          </button>
          <button
            className={`billing-tab ${activeTab === 'usage' ? 'active' : ''}`}
            onClick={() => setActiveTab('usage')}
          >
            📊 Usage
          </button>
        </div>
      </div>

      {/* Current Plan Summary - Shown on all tabs except Plans */}
      {activeTab !== 'plans' && currentPlan && (
        <div className="current-plan-summary">
          <div className="plan-summary-content">
            <div className="plan-summary-info">
              <span className="plan-badge">Current Plan</span>
              <h3 className="plan-summary-name">{currentPlan.name}</h3>
              <p className="plan-summary-price">
                {formatCurrency(currentPlan.price)}/{currentPlan.interval}
              </p>
              <span className={`plan-status ${subscription.status}`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>
            <div className="plan-summary-details">
              <div className="plan-summary-item">
                <span className="summary-label">Billing Cycle</span>
                <span className="summary-value">{subscription.autoRenew ? 'Auto-renew' : 'Manual'}</span>
              </div>
              <div className="plan-summary-item">
                <span className="summary-label">Next Billing Date</span>
                <span className="summary-value">{formatDate(subscription.endDate)}</span>
              </div>
              <div className="plan-summary-item">
                <span className="summary-label">Users</span>
                <span className="summary-value">{currentPlan.limits.users === -1 ? 'Unlimited' : currentPlan.limits.users}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="plans-tab">
          {/* Billing Toggle */}
          <div className="billing-toggle-container">
            <div className="billing-toggle">
              <button
                className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly <span className="save-badge">Save 20%</span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="plans-grid">
            {plans.map(plan => {
              const yearlyPrice = plan.price * 12 * 0.8; // 20% discount
              const displayPrice = billingCycle === 'yearly' ? yearlyPrice : plan.price;
              
              return (
                <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : ''} ${subscription.planId === plan.id ? 'current' : ''}`}>
                  {plan.popular && (
                    <div className="popular-badge">Most Popular</div>
                  )}
                  {subscription.planId === plan.id && (
                    <div className="current-badge">Current Plan</div>
                  )}
                  
                  <div className="plan-card-header">
                    <h3 className="plan-name">{plan.name}</h3>
                    <p className="plan-description">{plan.description}</p>
                  </div>

                  <div className="plan-pricing">
                    <span className="plan-price">
                      {plan.price === 0 ? 'Free' : formatCurrency(displayPrice)}
                    </span>
                    {plan.price > 0 && (
                      <span className="plan-interval">
                        /{billingCycle === 'yearly' ? 'year' : 'month'}
                      </span>
                    )}
                    {plan.discount && billingCycle === 'yearly' && (
                      <span className="plan-discount">-{plan.discount}%</span>
                    )}
                  </div>

                  <ul className="plan-features">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="plan-feature">
                        <span className="feature-check">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`plan-select-btn ${subscription.planId === plan.id ? 'current' : ''}`}
                    onClick={() => handlePlanSelect(plan.id)}
                    disabled={subscription.planId === plan.id}
                  >
                    {subscription.planId === plan.id ? 'Current Plan' : 'Choose Plan'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === 'subscription' && (
        <div className="subscription-tab">
          <div className="subscription-container">
            <div className="subscription-details">
              <h3 className="section-title">Subscription Details</h3>
              
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Plan</span>
                  <span className="detail-value">{currentPlan?.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value status-badge ${subscription.status}`}>
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Started</span>
                  <span className="detail-value">{formatDate(subscription.startDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Renewal Date</span>
                  <span className="detail-value">{formatDate(subscription.endDate)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Auto-Renew</span>
                  <span className="detail-value">
                    <button 
                      className={`toggle-switch ${subscription.autoRenew ? 'active' : ''}`}
                      onClick={toggleAutoRenew}
                    >
                      <span className="toggle-slider"></span>
                    </button>
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Payment Method</span>
                  <span className="detail-value">
                    {paymentMethods.find(pm => pm.id === subscription.paymentMethodId)?.brand || 'Not set'}
                    {paymentMethods.find(pm => pm.id === subscription.paymentMethodId)?.last4 && 
                      ` •••• ${paymentMethods.find(pm => pm.id === subscription.paymentMethodId)?.last4}`
                    }
                  </span>
                </div>
              </div>

              <div className="subscription-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => setActiveTab('plans')}
                >
                  Change Plan
                </button>
                <button 
                  className="action-btn danger"
                  onClick={handleCancelSubscription}
                >
                  Cancel Subscription
                </button>
              </div>
            </div>

            {/* Usage Summary */}
            <div className="usage-summary">
              <h3 className="section-title">Usage Summary</h3>
              <div className="usage-stats-grid">
                <div className="usage-stat">
                  <span className="usage-stat-value">{totalUsage.apiCalls.toLocaleString()}</span>
                  <span className="usage-stat-label">API Calls</span>
                </div>
                <div className="usage-stat">
                  <span className="usage-stat-value">{totalUsage.promptsUsed}</span>
                  <span className="usage-stat-label">Prompts Used</span>
                </div>
                <div className="usage-stat">
                  <span className="usage-stat-value">{totalUsage.usersActive}</span>
                  <span className="usage-stat-label">Active Users</span>
                </div>
                <div className="usage-stat">
                  <span className="usage-stat-value">{totalUsage.storageUsed}MB</span>
                  <span className="usage-stat-label">Storage Used</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {activeTab === 'payment' && (
        <div className="payment-tab">
          <div className="payment-container">
            <div className="payment-header">
              <h3 className="section-title">Payment Methods</h3>
              <button className="add-payment-btn">
                <span>+</span> Add Payment Method
              </button>
            </div>

            <div className="payment-methods-list">
              {paymentMethods.map(method => (
                <div key={method.id} className={`payment-method-card ${method.isDefault ? 'default' : ''}`}>
                  <div className="payment-method-icon">
                    {method.type === 'credit_card' && (
                      <span className="card-icon">
                        {method.brand === 'Visa' && '💳'}
                        {method.brand === 'Mastercard' && '💳'}
                        {!method.brand && '💳'}
                      </span>
                    )}
                    {method.type === 'paypal' && <span className="card-icon">💸</span>}
                    {method.type === 'bank_transfer' && <span className="card-icon">🏦</span>}
                  </div>
                  
                  <div className="payment-method-info">
                    <div className="payment-method-name">{method.name}</div>
                    <div className="payment-method-details">
                      {method.brand && <span>{method.brand}</span>}
                      {method.last4 && <span>•••• {method.last4}</span>}
                      {method.expiryDate && <span>Expires {method.expiryDate}</span>}
                    </div>
                  </div>

                  <div className="payment-method-actions">
                    {method.isDefault ? (
                      <span className="default-badge">Default</span>
                    ) : (
                      <button 
                        className="set-default-btn"
                        onClick={() => setDefaultPaymentMethod(method.id)}
                      >
                        Set Default
                      </button>
                    )}
                    <button 
                      className="remove-payment-btn"
                      onClick={() => removePaymentMethod(method.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <div className="invoices-tab">
          <div className="invoices-container">
            <div className="invoices-header">
              <h3 className="section-title">Invoice History</h3>
              <div className="invoice-filters">
                <select className="filter-select">
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="overdue">Overdue</option>
                </select>
                <select className="filter-select">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>

            <div className="invoices-list">
              {invoices.map(invoice => (
                <div key={invoice.id} className="invoice-card">
                  <div className="invoice-header-row">
                    <div className="invoice-number">
                      <span className="invoice-id">{invoice.number}</span>
                      <span className={`invoice-status ${invoice.status}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </div>
                    <div className="invoice-amount">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </div>
                  </div>

                  <div className="invoice-details">
                    <div className="invoice-detail">
                      <span className="detail-label">Date</span>
                      <span className="detail-value">{formatDate(invoice.date)}</span>
                    </div>
                    <div className="invoice-detail">
                      <span className="detail-label">Due Date</span>
                      <span className="detail-value">{formatDate(invoice.dueDate)}</span>
                    </div>
                    <div className="invoice-detail">
                      <span className="detail-label">Description</span>
                      <span className="detail-value">{invoice.description}</span>
                    </div>
                  </div>

                  <div className="invoice-actions">
                    <button className="invoice-action-btn">
                      📥 Download PDF
                    </button>
                    <button className="invoice-action-btn">
                      📧 Email
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Usage Tab */}
      {activeTab === 'usage' && (
        <div className="usage-tab">
          <div className="usage-container">
            <div className="usage-header">
              <h3 className="section-title">Usage Analytics</h3>
              <div className="usage-period">
                <button className="period-btn active">7 Days</button>
                <button className="period-btn">30 Days</button>
                <button className="period-btn">3 Months</button>
              </div>
            </div>

            <div className="usage-stats-grid">
              <div className="usage-stat-card">
                <div className="usage-stat-icon">📊</div>
                <div className="usage-stat-content">
                  <span className="usage-stat-number">{totalUsage.apiCalls.toLocaleString()}</span>
                  <span className="usage-stat-label">Total API Calls</span>
                  <div className="usage-stat-change positive">+12.5%</div>
                </div>
              </div>
              <div className="usage-stat-card">
                <div className="usage-stat-icon">💬</div>
                <div className="usage-stat-content">
                  <span className="usage-stat-number">{totalUsage.promptsUsed}</span>
                  <span className="usage-stat-label">Prompts Used</span>
                  <div className="usage-stat-change positive">+8.3%</div>
                </div>
              </div>
              <div className="usage-stat-card">
                <div className="usage-stat-icon">👥</div>
                <div className="usage-stat-content">
                  <span className="usage-stat-number">{totalUsage.usersActive}</span>
                  <span className="usage-stat-label">Active Users</span>
                  <div className="usage-stat-change positive">+15.2%</div>
                </div>
              </div>
              <div className="usage-stat-card">
                <div className="usage-stat-icon">💾</div>
                <div className="usage-stat-content">
                  <span className="usage-stat-number">{totalUsage.storageUsed}MB</span>
                  <span className="usage-stat-label">Storage Used</span>
                  <div className="usage-stat-change negative">+5.4%</div>
                </div>
              </div>
            </div>

            <div className="usage-chart-container">
              <h4>Daily Usage</h4>
              <div className="usage-chart">
                {usageData.map((day, index) => {
                  const maxApiCalls = Math.max(...usageData.map(d => d.apiCalls));
                  const height = (day.apiCalls / maxApiCalls) * 100;
                  
                  return (
                    <div key={index} className="chart-bar-container">
                      <div className="chart-bar-wrapper">
                        <div 
                          className="chart-bar" 
                          style={{ height: `${height}%` }}
                        >
                          <span className="chart-bar-value">{day.apiCalls}</span>
                        </div>
                      </div>
                      <span className="chart-label">
                        {formatDate(day.date).split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="usage-limits">
              <h4>Usage Limits</h4>
              <div className="usage-limits-grid">
                <div className="limit-item">
                  <div className="limit-header">
                    <span className="limit-label">API Calls</span>
                    <span className="limit-value">
                      {currentPlan?.limits.apiCalls === -1 ? 'Unlimited' : `${currentPlan?.limits.apiCalls.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: currentPlan?.limits.apiCalls === -1 ? '0%' : `${(totalUsage.apiCalls / (currentPlan?.limits.apiCalls || 1)) * 100}%`,
                        background: currentPlan?.limits.apiCalls === -1 ? '#e2e8f0' : undefined
                      }}
                    ></div>
                  </div>
                </div>
                <div className="limit-item">
                  <div className="limit-header">
                    <span className="limit-label">Storage</span>
                    <span className="limit-value">
                      {currentPlan?.limits.storage === -1 ? 'Unlimited' : `${currentPlan?.limits.storage}MB`}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: currentPlan?.limits.storage === -1 ? '0%' : `${(totalUsage.storageUsed / (currentPlan?.limits.storage || 1)) * 100}%`,
                        background: currentPlan?.limits.storage === -1 ? '#e2e8f0' : undefined
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Confirm Plan Change</h3>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>✕</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-plan-details">
                <div className="modal-plan-info">
                  <span className="modal-plan-name">{plans.find(p => p.id === selectedPlan)?.name}</span>
                  <span className="modal-plan-price">
                    {formatCurrency(plans.find(p => p.id === selectedPlan)?.price || 0)}
                    /{plans.find(p => p.id === selectedPlan)?.interval}
                  </span>
                </div>
                <p className="modal-plan-description">
                  {plans.find(p => p.id === selectedPlan)?.description}
                </p>
              </div>

              <div className="modal-payment-section">
                <h4>Payment Method</h4>
                <div className="modal-payment-options">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="payment-option">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        id={`pm-${method.id}`}
                        defaultChecked={method.isDefault}
                      />
                      <label htmlFor={`pm-${method.id}`}>
                        <span className="payment-option-brand">{method.brand}</span>
                        <span className="payment-option-details">
                          •••• {method.last4}
                          {method.isDefault && <span className="default-tag">Default</span>}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                <button className="add-payment-link">+ Add new payment method</button>
              </div>

              <div className="modal-summary">
                <div className="summary-row">
                  <span>Plan Price</span>
                  <span>{formatCurrency(plans.find(p => p.id === selectedPlan)?.price || 0)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (0%)</span>
                  <span>$0.00</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>{formatCurrency(plans.find(p => p.id === selectedPlan)?.price || 0)}</span>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-cancel" onClick={() => setShowPaymentModal(false)}>
                Cancel
              </button>
              <button 
                className="modal-confirm" 
                onClick={handleSubscriptionChange}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;