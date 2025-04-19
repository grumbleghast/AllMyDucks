import React from 'react';
import { Container, Row, Col, Card, Accordion, ListGroup } from 'react-bootstrap';
import { 
  BsCheckCircle, BsArrowLeftRight, BsPlusCircle, 
  BsTrash, BsPalette, BsMoon, BsKeyboard
} from 'react-icons/bs';

const HelpPage = () => {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h2 className="my-2 text-center">Help & Instructions</h2>
            </Card.Header>
            
            <Card.Body>
              <h4>Getting Started</h4>
              <p>Welcome to AllMyDucks, your personal task management app! Here's how it works:</p>
              
              <ListGroup variant="flush" className="mb-4">
                <ListGroup.Item className="d-flex align-items-center">
                  <div className="me-3 text-primary"><BsCheckCircle size={20} /></div>
                  <div>
                    <strong>Daily View</strong> - Each card shows tasks for a specific day
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex align-items-center">
                  <div className="me-3 text-primary"><BsArrowLeftRight size={20} /></div>
                  <div>
                    <strong>Navigate</strong> - Move between days using the arrow buttons
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex align-items-center">
                  <div className="me-3 text-primary"><BsPlusCircle size={20} /></div>
                  <div>
                    <strong>Add Tasks</strong> - Create new tasks with the "Add Task" button
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex align-items-center">
                  <div className="me-3 text-primary"><BsCheckCircle size={20} /></div>
                  <div>
                    <strong>Complete Tasks</strong> - Mark tasks as complete by checking them
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex align-items-center">
                  <div className="me-3 text-primary"><BsTrash size={20} /></div>
                  <div>
                    <strong>Delete Tasks</strong> - Remove tasks by hovering and clicking the X button
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex align-items-center">
                  <div className="me-3 text-primary"><BsPalette size={20} /></div>
                  <div>
                    <strong>Priority Colors</strong> - Tasks are color-coded by priority level
                  </div>
                </ListGroup.Item>
                
                <ListGroup.Item className="d-flex align-items-center">
                  <div className="me-3 text-primary"><BsMoon size={20} /></div>
                  <div>
                    <strong>Dark Mode</strong> - Toggle between light and dark mode in settings
                  </div>
                </ListGroup.Item>
              </ListGroup>
              
              <h4>Detailed Instructions</h4>
              <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Task Management</Accordion.Header>
                  <Accordion.Body>
                    <p><strong>Creating a task:</strong></p>
                    <ol>
                      <li>Click the "Add Task" button at the bottom of the to-do card</li>
                      <li>Enter your task description</li>
                      <li>Select priority (High, Medium, Low)</li>
                      <li>Click "Add" to save the task</li>
                    </ol>
                    
                    <p><strong>Completing a task:</strong></p>
                    <ol>
                      <li>Click the checkbox next to any task to mark it as completed</li>
                      <li>Completed tasks will show a strikethrough and move to the bottom</li>
                      <li>The progress bar will update to reflect your completion rate</li>
                    </ol>
                    
                    <p><strong>Deleting a task:</strong></p>
                    <ol>
                      <li>Hover over the task you want to delete</li>
                      <li>Click the trash icon that appears</li>
                      <li>Confirm deletion when prompted</li>
                    </ol>
                    
                    <p><strong>Editing a task:</strong></p>
                    <ol>
                      <li>Click the pencil icon next to any task</li>
                      <li>Modify the description or priority</li>
                      <li>Click "Save" to update the task</li>
                    </ol>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Navigation & Search</Accordion.Header>
                  <Accordion.Body>
                    <p><strong>Navigating between days:</strong></p>
                    <ol>
                      <li>Use the left arrow to go to the previous day</li>
                      <li>Use the right arrow to go to the next day</li>
                      <li>Click the date title to open a date picker</li>
                    </ol>
                    
                    <p><strong>Searching for tasks:</strong></p>
                    <ol>
                      <li>Click the "Search" icon in the navigation bar</li>
                      <li>Enter keywords to find specific tasks</li>
                      <li>Filter results by date range, priority, or completion status</li>
                    </ol>
                    
                    <p><strong>Viewing statistics:</strong></p>
                    <ol>
                      <li>Navigate to the "Dashboard" page</li>
                      <li>View productivity trends over time</li>
                      <li>See completion rates by day, week, or month</li>
                    </ol>
                  </Accordion.Body>
                </Accordion.Item>
                
                <Accordion.Item eventKey="2">
                  <Accordion.Header>Account & Preferences</Accordion.Header>
                  <Accordion.Body>
                    <p><strong>Profile settings:</strong></p>
                    <ol>
                      <li>Click your username or profile icon in the header</li>
                      <li>Navigate to "Profile" to update personal information</li>
                      <li>Use the "Change Password" tab to update your password</li>
                    </ol>
                    
                    <p><strong>Appearance:</strong></p>
                    <ol>
                      <li>Go to "Settings" in the user menu</li>
                      <li>Toggle between light and dark mode</li>
                      <li>Customize theme colors and font size</li>
                    </ol>
                    
                    <p><strong>Notifications:</strong></p>
                    <ol>
                      <li>Go to "Settings" in the user menu</li>
                      <li>Navigate to "Notifications"</li>
                      <li>Enable/disable email or push notifications for reminders</li>
                      <li>Set up custom notification timing</li>
                    </ol>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              
              <h4>Tips & Tricks</h4>
              <Card className="mb-3">
                <Card.Body>
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3 text-primary"><BsKeyboard size={20} /></div>
                    <div>
                      <strong>Keyboard Shortcuts</strong>
                      <p className="mb-0">Use "N" for next day, "P" for previous day, "A" to add a task</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3 text-primary"><BsArrowLeftRight size={20} /></div>
                    <div>
                      <strong>Task Sorting</strong>
                      <p className="mb-0">Tasks are automatically sorted by priority, then by creation time</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3 text-primary"><BsCheckCircle size={20} /></div>
                    <div>
                      <strong>Progress Tracking</strong>
                      <p className="mb-0">The progress bar shows your completion rate for the current day</p>
                    </div>
                  </div>
                  
                  <div className="d-flex align-items-center">
                    <div className="me-3 text-primary"><BsMoon size={20} /></div>
                    <div>
                      <strong>Syncing Across Devices</strong>
                      <p className="mb-0">Your tasks automatically sync when logged in on different devices</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default HelpPage; 