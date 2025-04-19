/**
 * Forgot Password component
 * Allows users to reset their password via email
 */
import React, { useState } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaKey, FaEnvelope } from 'react-icons/fa';
import './AuthForms.css';

/**
 * ForgotPassword component
 * @returns {JSX.Element} The rendered forgot password form
 */
const ForgotPassword = () => {
  // Form state
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validated, setValidated] = useState(false);
  
  /**
   * Handle email input change
   * @param {Object} e - Event object
   */
  const handleChange = (e) => {
    setEmail(e.target.value);
  };
  
  /**
   * Handle form submission
   * @param {Object} e - Event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    // Form validation
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    setIsLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // TODO: Implement actual API password reset request
      // const response = await requestPasswordReset(email);
      
      // Simulated API call for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="auth-card">
            <Card.Body>
              <div className="text-center mb-4">
                <FaKey className="auth-icon" />
                <h2>Forgot Password</h2>
                <p className="text-muted">Enter your email to reset your password</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  Password reset link has been sent to your email address. Please check your inbox.
                </Alert>
              )}
              
              {!success ? (
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Form.Group className="mb-4" controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
                      </span>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email address.
                      </Form.Control.Feedback>
                    </div>
                  </Form.Group>
                  
                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </Form>
              ) : (
                <Button 
                  variant="outline-primary" 
                  as={Link} 
                  to="/login"
                  className="w-100 mt-3"
                >
                  Back to Login
                </Button>
              )}
              
              <div className="text-center mt-4">
                <p>
                  <Link to="/login">Return to Login</Link> | <Link to="/register">Create Account</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPassword; 