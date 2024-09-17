const express = require('express');
const app = express();
const path = require('path');
const port = 3000; // This matches the port in the HTML file
const mysql = require('mysql2/promise');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password] // Note: In a real app, you should compare hashed passwords
    );
    if (rows.length > 0) {
      res.json({ success: true, userId: rows[0].id });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// Task routes
app.get('/tasks', (req, res) => {
  // TODO: Implement fetching tasks from database
  res.json([]);
});

app.post('/tasks', (req, res) => {
  // TODO: Implement adding a new task to database
  res.json({ success: true });
});

app.put('/tasks/:id', (req, res) => {
  // TODO: Implement updating a task in database
  res.json({ success: true });
});

app.delete('/tasks/:id', (req, res) => {
  // TODO: Implement deleting a task from database
  res.json({ success: true });
});

// Registration route
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password] // Note: In a real app, you should hash the password
    );
    res.json({ success: true, userId: result.insertId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

// Registration GET route
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Add a catch-all route for handling 404 errors
app.use((req, res) => {
  res.status(404).send('404 - Page not found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('500 - Internal Server Error');
});

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'task_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please choose a different port.`);
  } else {
    console.error('An error occurred while starting the server:', error);
  }
  process.exit(1);
});