/**
 * Header component for the AllMyDucks application
 * Contains logo, navigation, and authentication controls
 */
import React, { useState } from 'react';
import { Navbar, Nav, Container, Button, Form, Dropdown, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { BsSearch, BsQuestionCircle, BsPersonCircle, BsList, BsSun, BsMoon, BsCalendar } from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

/**
 * Header component
 * @returns {JSX.Element} The rendered component
 */
const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showDateSearch, setShowDateSearch] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  
  /**
   * Handle logout button click
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  /**
   * Handle date search submission
   */
  const handleDateSearch = (e) => {
    e.preventDefault();
    if (searchDate) {
      // Navigate to search results page with the date
      navigate(`/search?date=${searchDate}`);
      setShowDateSearch(false);
    }
  };
  
  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="header">
      <Container>
        {/* Logo and brand name */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src="/images/logo.png"
            width="35"
            height="35"
            className="d-inline-block align-top me-2"
            alt="Rubber Duck Logo"
          />
          <span>All My Ducks</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated ? (
              <>
                {/* ToDo List Link */}
                <Nav.Link as={Link} to="/todos" title="My ToDo Lists" className="nav-icon-link">
                  <BsList className="nav-icon" />
                  <span className="nav-text">My Lists</span>
                </Nav.Link>
                
                {/* Search Button with tooltip */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Search by date</Tooltip>}
                >
                  <Nav.Link 
                    onClick={() => setShowDateSearch(!showDateSearch)} 
                    className="nav-icon-link"
                  >
                    <BsCalendar className="nav-icon" />
                    <span className="nav-text">Date Search</span>
                  </Nav.Link>
                </OverlayTrigger>
                
                {/* Date search dropdown */}
                {showDateSearch && (
                  <Form className="date-search-form" onSubmit={handleDateSearch}>
                    <InputGroup>
                      <Form.Control
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        aria-label="Search by date"
                      />
                      <Button variant="outline-light" type="submit">
                        <BsSearch />
                      </Button>
                    </InputGroup>
                  </Form>
                )}
                
                {/* Help Link */}
                <Nav.Link as={Link} to="/help" title="Help" className="nav-icon-link">
                  <BsQuestionCircle className="nav-icon" />
                  <span className="nav-text">Help</span>
                </Nav.Link>
                
                {/* Dark Mode Toggle */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</Tooltip>}
                >
                  <Nav.Link onClick={toggleTheme} className="nav-icon-link">
                    {darkMode ? (
                      <BsSun className="nav-icon" />
                    ) : (
                      <BsMoon className="nav-icon" />
                    )}
                    <span className="nav-text">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </Nav.Link>
                </OverlayTrigger>
                
                {/* User Profile */}
                <Nav.Link as={Link} to="/profile" title="Profile" className="nav-icon-link">
                  <BsPersonCircle className="nav-icon" />
                  <span className="nav-text">{user?.firstName || 'Profile'}</span>
                </Nav.Link>
                
                {/* Logout Button (Visible on smaller screens as text link) */}
                <Nav.Link onClick={handleLogout} className="d-lg-none">
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                {/* Login and Register links for unauthenticated users */}
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                
                {/* Dark Mode Toggle for unauthenticated users */}
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</Tooltip>}
                >
                  <Nav.Link onClick={toggleTheme} className="nav-icon-link">
                    {darkMode ? (
                      <BsSun className="nav-icon" />
                    ) : (
                      <BsMoon className="nav-icon" />
                    )}
                    <span className="nav-text">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                  </Nav.Link>
                </OverlayTrigger>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header; 