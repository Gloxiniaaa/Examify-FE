# Examify - Online Examination System

A modern web-based examination platform that enables teachers to create, manage tests and students to take exams online.

## Features

- **User Authentication**
  - Secure login and signup system
  - Role-based access (Teacher/Student)
  - User profile management

- **Teacher Features**
  - Create and edit tests with multiple questions
  - Set test duration and time windows
  - Secure test access with passcodes
  - View detailed student submissions
  - Real-time test results and analytics

- **Student Features**
  - Access tests with passcode
  - Take exams in a controlled environment
  - View instant results after submission
  - Track test history and performance

## Tech Stack

- Frontend:
  - React 18
  - Redux Toolkit for state management
  - React Router v6
  - Tailwind CSS for styling
  - Lucide React for icons
  - React Toastify for notifications

- Backend Integration:
  - RESTful API integration
  - JWT authentication
  - Axios for API requests

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Backend API server running on port 8090

### Environment Setup

Create a `.env` file in the root directory:
```
VITE_REACT_APP_BE_API_URL=http://localhost:8090
VITE_REACT_APP_FE_API_URL=http://localhost:5173
```

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
ExamWeb/
├── src/
│   ├── components/    # Reusable UI components like NavBar, Footer
│   ├── pages/        # Page components (Login, Dashboard, Tests)
│   ├── store/        # Redux store, slices, and actions
│   ├── CSS/          # Global styles and CSS modules
│   └── assets/       # Images and static assets
├── public/           # Static files
└── index.html        # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## License

MIT License - Feel free to use and modify for your own projects.
