/**
 * TodoPage component to display TodoCard with API integration
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BsQuestionCircle } from 'react-icons/bs';
import TodoCard from '../components/TodoCard';

/**
 * Parse date from URL parameter or create a new date
 * @param {string} dateParam - URL date parameter
 * @returns {Date} Parsed date
 */
const parseDate = (dateParam) => {
  if (!dateParam) return new Date();
  
  try {
    // Validate format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return new Date();
    }
    
    const date = new Date(dateParam);
    // Check if the date is valid
    return isNaN(date.getTime()) ? new Date() : date;
  } catch (err) {
    console.error('Invalid date parameter:', err);
    return new Date();
  }
};

/**
 * TodoPage component
 * @returns {JSX.Element} The rendered component
 */
const TodoPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const [initialDate, setInitialDate] = useState(parseDate(dateParam));
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Update initialDate when the URL parameter changes
  useEffect(() => {
    setInitialDate(parseDate(dateParam));
  }, [dateParam]);
  
  if (authLoading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect to login
  }
  
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1 className="text-center mb-4">My To-Do Lists</h1>
          
          <TodoCard 
            initialDate={initialDate} 
            useApi={true} 
          />
          
          <div className="text-center mt-4">
            <Link to="/help">
              <Button variant="outline-info" size="sm">
                <BsQuestionCircle className="me-2" />
                Need help using the app?
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TodoPage; 