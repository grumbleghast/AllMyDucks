/**
 * SearchPage component for displaying todo results by date
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TodoCard from '../components/TodoCard';
import { BsCalendar, BsSearch } from 'react-icons/bs';

/**
 * SearchPage component
 * @returns {JSX.Element} The rendered component
 */
const SearchPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const [searchDate, setSearchDate] = useState(dateParam || '');
  const [hasSearched, setHasSearched] = useState(!!dateParam);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);
  
  // Update search date when URL parameter changes
  useEffect(() => {
    if (dateParam) {
      setSearchDate(dateParam);
      setHasSearched(true);
    }
  }, [dateParam]);
  
  /**
   * Handle date search submission
   * @param {Object} e - Event object
   */
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchDate) {
      navigate(`/search?date=${searchDate}`);
      setHasSearched(true);
    }
  };
  
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
          <Card className="mb-4 p-4">
            <h2 className="text-center mb-4">
              <BsSearch className="me-2" /> Search Tasks by Date
            </h2>
            
            <Form onSubmit={handleSearch}>
              <Row className="align-items-end">
                <Col sm={8}>
                  <Form.Group controlId="searchDate">
                    <Form.Label>Select a date</Form.Label>
                    <Form.Control
                      type="date"
                      value={searchDate}
                      onChange={(e) => setSearchDate(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col sm={4}>
                  <Button type="submit" variant="primary" className="w-100">
                    <BsSearch className="me-2" /> Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
          
          {hasSearched && (
            <>
              <h3 className="text-center mb-4">
                {searchDate ? (
                  <>
                    <BsCalendar className="me-2" />
                    Tasks for {new Date(searchDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </>
                ) : (
                  'No date selected'
                )}
              </h3>
              
              {searchDate ? (
                <TodoCard 
                  initialDate={new Date(searchDate)} 
                  useApi={true} 
                />
              ) : (
                <Alert variant="warning">
                  Please select a date to search for tasks.
                </Alert>
              )}
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchPage; 