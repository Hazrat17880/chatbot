import React from 'react';

// TypeScript interface for the user data
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  emailVerified: boolean;
  role: 'user' | 'admin' | 'moderator'; // extend as needed
}

// Sample user data
const userData: User = {
  id: "6a54cf1073bd4e0ee941beb3",
  firstName: "Hazrat",
  lastName: "usman",
  email: "hazrat17780@gmail.com",
  username: "hazrat17780",
  emailVerified: true,
  role: "user"
};

// Component Props (if you want to pass user data as props)
interface ProfilePageProps {
  user?: User;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ user = userData }) => {
  // Format the full name
  const fullName = `${user.firstName} ${user.lastName}`;
  
  // Get initials for avatar
  const getInitials = (): string => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Status badge color based on role
  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case 'admin':
        return '#dc3545';
      case 'moderator':
        return '#fd7e14';
      default:
        return '#28a745';
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Header with avatar and name */}
        <div className="profile-header">
          <div className="avatar-wrapper">
            <div className="avatar">
              {getInitials()}
            </div>
            <div className={`status-dot ${user.emailVerified ? 'verified' : 'unverified'}`} 
                 title={user.emailVerified ? 'Email Verified' : 'Email Not Verified'}>
            </div>
          </div>
          
          <div className="user-info">
            <h1 className="user-name">{fullName}</h1>
            <p className="user-username">@{user.username}</p>
            <div className="user-badges">
              <span className="badge role-badge" style={{ backgroundColor: getRoleBadgeColor(user.role) }}>
                <i className="fas fa-user-tag"></i> {user.role}
              </span>
              <span className={`badge email-badge ${user.emailVerified ? 'verified-badge' : 'unverified-badge'}`}>
                {user.emailVerified ? (
                  <><i className="fas fa-check-circle"></i> Verified</>
                ) : (
                  <><i className="fas fa-exclamation-circle"></i> Unverified</>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* User details */}
        <div className="profile-details">
          <div className="detail-item">
            <div className="detail-icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user.email}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <i className="fas fa-id-card"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">User ID</span>
              <span className="detail-value id-value">{user.id}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <i className="fas fa-user"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Username</span>
              <span className="detail-value">{user.username}</span>
            </div>
          </div>

          <div className="detail-item">
            <div className="detail-icon">
              <i className="fas fa-user-shield"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Role</span>
              <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="profile-actions">
          <button className="btn btn-primary">
            <i className="fas fa-edit"></i> Edit Profile
          </button>
          <button className="btn btn-secondary">
            <i className="fas fa-cog"></i> Settings
          </button>
        </div>

        {/* Footer with additional info */}
        <div className="profile-footer">
          <span className="footer-text">
            <i className="fas fa-shield-alt"></i> Account secured
          </span>
          <span className="footer-text">
            <i className={`fas ${user.emailVerified ? 'fa-check-circle text-success' : 'fa-clock text-warning'}`}></i>
            {user.emailVerified ? ' Email confirmed' : ' Pending verification'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;