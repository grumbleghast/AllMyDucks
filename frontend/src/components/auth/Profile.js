/**
 * User Profile management component
 * Allows users to view and edit their profile information
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Nav } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaLock, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AuthForms.css';

/**
 * Profile component
 * @returns {JSX.Element} The rendered profile management interface
 */
const Profile = () => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, loading]);
  
  // Profile tab state
  const [activeTab, setActiveTab] = useState('profile');
  
  if (loading || !isAuthenticated) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="auth-card profile-card">
            <Card.Body>
              <div className="text-center mb-4">
                <div className="profile-avatar">
                  <FaUser className="profile-icon" />
                </div>
                <h2 className="mt-3">{user?.firstName || 'User'}'s Profile</h2>
                <p className="text-muted">Manage your account settings</p>
              </div>
              
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                <Row>
                  <Col sm={3}>
                    <Nav variant="pills" className="flex-column profile-nav">
                      <Nav.Item>
                        <Nav.Link eventKey="profile">
                          <FaUser className="me-2" /> Profile
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="password">
                          <FaLock className="me-2" /> Password
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link onClick={() => logout()}>
                          <FaSignOutAlt className="me-2" /> Logout
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col sm={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="profile">
                        <ProfileInfoTab />
                      </Tab.Pane>
                      <Tab.Pane eventKey="password">
                        <PasswordChangeTab />
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

/**
 * ProfileInfoTab component
 * @returns {JSX.Element} Profile information editing tab
 */
const ProfileInfoTab = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    email: user?.email || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // TODO: Implement actual API update call
      // await updateProfile(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-3">
      <h4 className="mb-4">Edit Profile Information</h4>
      
      {message.text && (
        <Alert variant={message.type}>{message.text}</Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formFirstName">
          <Form.Label>First Name</Form.Label>
          <div className="input-group">
            <span className="input-group-text">
              <FaUser />
            </span>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
        </Form.Group>
        
        <Form.Group className="mb-4" controlId="formEmail">
          <Form.Label>Email Address</Form.Label>
          <div className="input-group">
            <span className="input-group-text">
              <FaEnvelope />
            </span>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled
            />
          </div>
          <Form.Text className="text-muted">
            Email address cannot be changed.
          </Form.Text>
        </Form.Group>
        
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </Form>
    </div>
  );
};

/**
 * PasswordChangeTab component
 * @returns {JSX.Element} Password change tab
 */
const PasswordChangeTab = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: 'danger',
        text: 'New passwords do not match.'
      });
      return;
    }
    
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // TODO: Implement actual API password change
      // await changePassword(formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Clear form after successful update
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setMessage({
        type: 'success',
        text: 'Password changed successfully!'
      });
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to change password. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-3">
      <h4 className="mb-4">Change Password</h4>
      
      {message.text && (
        <Alert variant={message.type}>{message.text}</Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formCurrentPassword">
          <Form.Label>Current Password</Form.Label>
          <div className="input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <Form.Control
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              placeholder="Enter your current password"
            />
          </div>
        </Form.Group>
        
        <Form.Group className="mb-3" controlId="formNewPassword">
          <Form.Label>New Password</Form.Label>
          <div className="input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <Form.Control
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Create a new password"
            />
          </div>
          <Form.Text className="text-muted">
            Password must be at least 6 characters long.
          </Form.Text>
        </Form.Group>
        
        <Form.Group className="mb-4" controlId="formConfirmPassword">
          <Form.Label>Confirm New Password</Form.Label>
          <div className="input-group">
            <span className="input-group-text">
              <FaLock />
            </span>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Confirm your new password"
            />
          </div>
        </Form.Group>
        
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </Button>
      </Form>
    </div>
  );
};

export default Profile; 