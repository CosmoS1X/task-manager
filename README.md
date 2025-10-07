# Task Manager

[![Node.js CI](https://github.com/CosmoS1X/new-typescript-project/actions/workflows/node.js.yml/badge.svg)](https://github.com/CosmoS1X/new-typescript-project/actions/workflows/node.js.yml)
[![Maintainability](https://qlty.sh/gh/CosmoS1X/projects/task-manager/maintainability.svg)](https://qlty.sh/gh/CosmoS1X/projects/task-manager)
[![Code Coverage](https://qlty.sh/gh/CosmoS1X/projects/task-manager/coverage.svg)](https://qlty.sh/gh/CosmoS1X/projects/task-manager)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

Task Manager is a full-stack application for efficient task management with a modern UI and robust backend. It enables teams to organize, track, and prioritize work effectively.

🔗 [Live Demo](https://new-typescript-project.onrender.com/)

## ✨ Key Features

### Task Management
- ✅ Create, edit, and delete tasks with rich metadata
- 🔍 Advanced filtering by status, labels, assignee, and creator
- 🏷️ Custom statuses and labels configuration

### User Experience
- 👤 User authentication and authorization
- 📱 Responsive design for all devices

### Technical Highlights
- 🚀 RESTful API with TypeScript
- 🛡️ Secure authentication
- 📊 PostgreSQL (production) / SQLite (development)
- 📦 Database migrations
- 🧪 Comprehensive test coverage

## Technology Stack

### Frontend

- **React** with **TypeScript**
- **Redux Toolkit** for state management
- **RTK Query** for data fetching and caching
- **React Router** for navigation
- **Bootstrap** with custom styling
- **React Hook Form** for forms
- **Zod** for form validation
- **i18next** for internationalization

### Backend

- **TypeScript** with **Node.js**
- **NestJS** for RESTful API
- **Objection.js** as ORM
- **Knex.js** for database connection and migrations
- **Zod** for environment variable validation
- **dotenv** for environment variable management

### Infrastructure

- **PostgreSQL** for production database
- **SQLite** for development/testing database
- **Jest** for unit and integration tests
- **ESLint** for code quality
- **GitHub Actions** for CI/CD
- **Docker** for containerization
- **Render** for deployment

## Getting Started

### Prerequisites

- Node.js 24+
- PostgreSQL 16+ (for production)
- npm 11+

### Installation

1. Clone the repository:

    ```bash
    git clone git@github.com:CosmoS1X/task-manager.git
    cd task-manager
    ```

2. Install dependencies:

    ```bash
    npm install
    ```
3. Setup environment variables:

    ```bash
    cp .env.example .env
    ```
  
4. Configure the `.env` file with your database credentials and other settings.

5. Database Setup:

    - For development, SQLite is used by default.
    - For production, configure PostgreSQL in `.env`.

6. Run migrations:

    ```bash
    npm run migrate
    ```

### 🏃‍♂️ Running the App

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start development server (client + server) |
| `npm run client` | Frontend only (port 3000) |
| `npm run server` | Backend only (port 5000) |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server |

### 🧪 Testing

The test suite uses SQLite for fast execution:

```bash
# Run all tests
npm test

# Run specific test suite
npm test <path-to-test-file>

# Test coverage
npm run test:coverage
```

### 🚀 Deployment

The application can be deployed to any Node.js hosting platform. For Render.com:

1. Create a new Web Service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch
3. Commit your changes
3. Push to the branch
4. Open a Pull Request

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for more information.
