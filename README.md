# Team Task Manager

A full-stack team task management application for creating projects, managing members, assigning tasks, and tracking progress with role-based access.

## Live Links

- Live application: `https://task-manager-umber-zeta.vercel.app/`
- Backend API: `https://task-manager-bl8e.onrender.com`
- GitHub repository: `https://github.com/Sailesh13K/task_manager`

## Features

- User signup and login with JWT authentication
- Project creation with the creator assigned as Admin
- Admin member management for adding and removing project members
- Task creation with title, description, due date, priority, status, assignee, and project
- Task status tracking: To Do, In Progress, Done
- Dashboard metrics for total tasks, tasks by status, tasks per user, and overdue tasks
- Role-based access control:
  - Admins can manage project members and tasks
  - Members can view projects and update only their assigned tasks
- RESTful Spring Boot API with validation and centralized error handling
- PostgreSQL database for production

## Tech Stack

Frontend:

- React
- Vite

Backend:

- Java 17+
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT
- PostgreSQL
- Maven

Testing:

- JUnit 5
- H2 in-memory database for test profile only

## Project Structure

```text
task-manager/
--> client/       # React + Vite frontend
--> server/       # Spring Boot backend
--> README.md
```

## Backend Setup

Go to the backend folder:

```bash
cd server
```

Create a `.env` file in `server/`:

```env
DB_URL=jdbc:postgresql://localhost:5432/taskmanager
DB_USERNAME=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_base64_encoded_secret_key
```

Run tests:

```bash
mvn test
```

Build the deployable jar:

```bash
mvn package
```

Run the backend:

```bash
java -jar target/taskmanager-0.0.1-SNAPSHOT.jar
```

The backend starts on the default Spring Boot port:

```text
http://localhost:8080
```

Swagger API documentation:

```text
http://localhost:8080/swagger-ui.html
```

## Frontend Setup

Go to the frontend folder:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Run the frontend:

```bash
npm run dev
```

Build the frontend:

```bash
npm run build
```

## API Overview

Authentication:

- `POST /api/auth/signup`
- `POST /api/auth/login`

Projects:

- `POST /api/projects`
- `GET /api/projects/my-projects`
- `GET /api/projects/{projectId}`
- `GET /api/projects/{projectId}/members`
- `POST /api/projects/{projectId}/members`
- `DELETE /api/projects/{projectId}/members/{userId}`

Tasks:

- `POST /api/tasks`
- `GET /api/tasks/project/{projectId}`
- `GET /api/tasks/my-tasks`
- `PUT /api/tasks/{taskId}`
- `PUT /api/tasks/{taskId}/status`
- `PUT /api/tasks/{taskId}/assign`
- `DELETE /api/tasks/{taskId}`

Dashboard:

- `GET /api/dashboard`

User:

- `GET /api/users/me`

Protected API routes require:

```text
Authorization: Bearer <jwt_token>
```

## Deployment

The backend is deployed on Render using Docker. The frontend is deployed on Vercel.

### Backend

1. Create a new Render Web Service from the GitHub repository.
2. Select Docker as the runtime.
3. Set the root directory to `server`.
4. Use the existing Dockerfile:

```text
server/Dockerfile
```

5. Add a PostgreSQL database service.
6. Add these backend environment variables in Render:

```env
DB_URL=jdbc:postgresql://<database-host>:<database-port>/<database-name>
DB_USERNAME=<database-username>
DB_PASSWORD=<database-password>
JWT_SECRET=<base64_encoded_secret_key>
app.cors.allowed-origins=<vercel_frontend_url>
```

The Dockerfile builds the Spring Boot application and starts the jar:

```bash
./mvnw clean package -DskipTests
java -jar target/*.jar
```

### Frontend

1. Create a Vercel project from the GitHub repository.
2. Set the root directory to `client`.
3. Add this frontend environment variable in Vercel:

```env
VITE_API_BASE_URL=<render_backend_url>
```

4. Use the default Vite build settings:

```text
Build command: npm run build
Output directory: dist
```

## Test Result

Backend verification:

```text
mvn package
BUILD SUCCESS
Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
```

## Notes

- PostgreSQL is used for the deployed application.
- H2 is used only for automated tests through the `test` profile.
- Environment variables are not committed to the repository.
- The application must be deployed with both frontend and backend URLs configured correctly.
