# AllMyDucks

A modern, intuitive To-Do list application with a clean, minimalist UI.

## Project Structure

The project is organized into frontend and backend directories:

### Frontend (React)

```
frontend/
├── public/           # Static files
├── src/              # Source code
│   ├── assets/       # Images, fonts, etc.
│   ├── components/   # Reusable UI components
│   ├── pages/        # Page components
│   ├── services/     # API services
│   └── utils/        # Utility functions
└── package.json      # Dependencies and scripts
```

### Backend (Node.js/Express)

```
backend/
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middleware/       # Express middleware
├── models/           # Mongoose models
├── routes/           # API routes
├── utils/            # Utility functions
└── server.js         # Main server file
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```
   cd frontend
   npm start
   ```

## Features

- User authentication (register, login, password recovery)
- Create, edit, and delete To-Do items
- Mark items as complete/incomplete
- Navigate between different days
- Rich text editing for tasks
- Dark mode theme option
- Task prioritization (High, Normal, Low)
- Automatic transfer of incomplete tasks
- Responsive design for mobile and desktop

## Technologies Used

- **Frontend**: React, React Bootstrap, HTML, CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
