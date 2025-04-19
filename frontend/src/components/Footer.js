/**
 * Footer component for the AllMyDucks application
 * Contains motivational quote and policy links
 */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

/**
 * Footer component
 * @returns {JSX.Element} The rendered component
 */
const Footer = () => {
  // State for motivational quote
  const [quote, setQuote] = useState({
    text: "Do it now—your future self will thank you for not waiting.",
    author: "ChatGPT"
  });

  // Placeholder for fetching quote from API
  // In a real implementation, this would call an API to get a quote
  useEffect(() => {
    // For now, we'll use the default quote
    // Later, this would fetch a quote from the backend or ChatGPT API
  }, []);

  return (
    <footer className="footer">
      <Container>
        <Row className="py-3">
          <Col className="text-center quote-container">
            <p className="quote mb-0">"{quote.text}"</p>
            <p className="quote-author">— {quote.author}</p>
          </Col>
        </Row>
        <Row className="py-2 policy-links">
          <Col className="text-center">
            <Link to="/privacy" className="me-3">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
          </Col>
        </Row>
        <Row className="py-1">
          <Col className="text-center">
            <p className="copyright mb-0">&copy; {new Date().getFullYear()} AllMyDucks</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 