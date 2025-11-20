Step 1: Clone the Repository
bash
git clone https://github.com/yourusername/task-manager.git
cd task-manager
Step 2: Backend Setup
2.1 Navigate to Backend Directory
bash
cd backend
2.2 Install Dependencies
bash
npm install
This will install:

express

mongoose

bcryptjs

jsonwebtoken

dotenv

cors

joi

2.3 Create Environment File
Create a .env file in the backend directory:

bash
touch .env
Add the following configuration:

text
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/taskmanager

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_chars
JWT_EXPIRE=7d
⚠️ Important: Change JWT_SECRET to a strong, random string for production.

2.4 Verify MongoDB Connection
Ensure MongoDB is running:

bash
# Windows (if running as service)
net start MongoDB

# macOS/Linux
sudo systemctl status mongod
# or
brew services list | grep mongodb
2.5 Start Backend Server
bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
You should see:

text
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
Step 3: Frontend Setup
3.1 Open New Terminal and Navigate to Frontend Directory
bash
cd frontend
3.2 Install Dependencies
bash
npm install
This will install:

react

react-dom

react-router-dom

axios

vite

3.3 Create Vite Configuration
The vite.config.js file should already exist with:

javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
3.4 Start Frontend Development Server
bash
npm run dev
You should see:

text
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
Configuration
Backend Configuration Options
Environment Variables
Variable	Description	Default	Required
PORT	Server port number	5000	No
MONGODB_URI	MongoDB connection string	mongodb://localhost:27017/taskmanager	Yes
JWT_SECRET	Secret key for JWT signing	-	Yes
JWT_EXPIRE	JWT token expiration time	7d	No
NODE_ENV	Environment mode	development	No
MongoDB Connection Strings
Local MongoDB:

text
mongodb://localhost:27017/taskmanager
MongoDB Atlas (Cloud):

text
mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
Frontend Configuration
The frontend uses environment variables prefixed with VITE_. Create .env in the frontend directory if needed:

text
VITE_API_URL=http://localhost:5000/api
Running the Application
Development Mode
Terminal 1 - Backend:

bash
cd backend
npm run dev
Terminal 2 - Frontend:

bash
cd frontend
npm run dev
Accessing the Application
Frontend: http://localhost:3000

Backend API: http://localhost:5000/api

Health Check: http://localhost:5000/api/health

API Documentation
Authentication Endpoints
Register User
text
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
Response:

json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "60d5ec49f1b2c72b8c8e4f1a",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
Login
text
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
Task Endpoints
All task endpoints require authentication. Include JWT token in headers:

text
Authorization: Bearer <your_jwt_token>
Create Task
text
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive README",
  "status": "pending"
}
Get All Tasks
text
GET /api/tasks?page=1&limit=10&status=pending&search=project
Authorization: Bearer <token>
Query Parameters:

page (optional): Page number (default: 1)

limit (optional): Items per page (default: 10)

status (optional): Filter by status (pending, in-progress, completed)

search (optional): Search in title and description

Get Single Task
text
GET /api/tasks/:id
Authorization: Bearer <token>
Update Task
text
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "status": "completed"
}
Delete Task
text
DELETE /api/tasks/:id
Authorization: Bearer <token>
Testing
Create Test Users
Admin User
bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
  }'
Regular User
bash
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "user@test.com",
    "password": "user123",
    "role": "user"
  }'
Test Workflow
Register a new user at http://localhost:3000/register

Login with credentials

Create tasks from the dashboard

Test filtering by status

Test search functionality

Test pagination with multiple tasks

Login as admin to view all tasks

Test admin deletion of any task

Manual Testing Checklist
 User registration works

 User login works

 JWT token is stored in localStorage

 Protected routes redirect to login

 Users can create tasks

 Users can edit their own tasks

 Users can delete their own tasks

 Users can only see their own tasks

 Admin can see all tasks

 Admin can delete any task

 Search functionality works

 Filter by status works

 Pagination works

 Logout clears authentication

Deployment
Production Build
Backend Deployment
Prepare for production:

Update .env for production:

text
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_very_secure_random_string_min_32_characters
JWT_EXPIRE=7d
Start with PM2 (Process Manager):

bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start server.js --name task-manager-api

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
Frontend Deployment
Build for production:

bash
cd frontend
npm run build
This creates an optimized production build in the dist folder.​

Deploy options:

Option 1: Serve with Express (Same Server)

bash
# In backend/server.js, add:
const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}
Option 2: Deploy to Vercel (Frontend)

bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
Option 3: Deploy to Netlify

bash
# Build command: npm run build
# Publish directory: dist
Deployment Platforms​
Backend Options:
Heroku: Easy deployment with MongoDB Atlas

Railway: Modern platform with PostgreSQL/MongoDB support

AWS EC2: Full control, requires more setup

DigitalOcean: VPS with Docker support

Render: Free tier available

Database Options:
MongoDB Atlas: Free tier, cloud-hosted MongoDB

Railway: Managed MongoDB

DigitalOcean Managed Databases

Environment-Specific Configuration
Development:

bash
npm run dev
Production:

bash
NODE_ENV=production npm start
Troubleshooting
Common Issues
1. MongoDB Connection Error
Error: MongooseServerSelectionError: connect ECONNREFUSED

Solution:

bash
# Check if MongoDB is running
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
2. Port Already in Use
Error: EADDRINUSE: address already in use :::5000

Solution:

bash
# Find process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill -9
3. JWT Token Invalid
Error: Not authorized, token invalid

Solution:

Clear localStorage in browser

Re-login to get new token

Check JWT_SECRET matches in .env

4. CORS Errors
Error: Access to XMLHttpRequest has been blocked by CORS policy

Solution:
Ensure backend has CORS enabled (already configured in server.js):

javascript
app.use(cors());
5. Vite Build Errors
Error: Cannot find module 'vite'

Solution:

bash
cd frontend
rm -rf node_modules package-lock.json
npm install
6. Module Not Found Errors
Solution:

bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
Debug Mode
Enable debug logging:

Backend (server.js):

javascript
mongoose.set('debug', true);
Frontend (Browser Console):

javascript
localStorage.setItem('debug', '*');
Logging
Backend logs:

bash
# Using PM2
pm2 logs task-manager-api

# Direct logging
NODE_ENV=development npm run dev > logs/app.log 2>&1
Project Structure Reference
text
task-manager/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js               # JWT authentication
│   │   └── roleCheck.js          # Role-based access
│   ├── models/
│   │   ├── User.js               # User schema
│   │   └── Task.js               # Task schema
│   ├── routes/
│   │   ├── auth.js               # Auth routes
│   │   └── tasks.js              # Task routes
│   ├── validators/
│   │   └── taskValidator.js      # Joi validation
│   ├── .env                      # Environment variables
│   ├── server.js                 # Express server
│   └── package.json              # Dependencies
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskForm.jsx
    │   │   └── Navbar.jsx
    │   ├── pages/
    │   │   ├── Register.jsx
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   └── TaskEdit.jsx
    │   ├── services/
    │   │   └── api.js            # Axios configuration
    │   ├── context/
    │   │   └── AuthContext.jsx   # Auth state management
    │   ├── App.jsx               # Main app component
    │   ├── main.jsx              # React entry point
    │   └── index.css             # Global styles
    ├── index.html
    ├── vite.config.js
    └── package.json