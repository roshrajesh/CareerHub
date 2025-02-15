// Import required modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

require('dotenv').config(); // Load environment variables from the .env file

// Import models
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const RecruitmentJob = require('./models/RecruitmentJob');
const Student = require('./models/Student');
const Contact = require('./models/Contact');
const studentRoutes = require("./routes/studentRoutes");

// Import routes
const applicationsRoute = require('./routes/applicationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const dashboardRoute = require('./routes/dashboard');  // Import dashboard route
const resetPasswordRoutes = require("./routes/resetPassword");

const app = express();
const JWT_SECRET = 'your_secret_key'; // Replace with a secure key

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', applicationsRoute);
app.use('/api/contact', contactRoutes);
app.use("/api/auth", require("./routes/authRoutes"));
// Route handler for applications

// Use student routes
app.use(studentRoutes);

app.use("/api", resetPasswordRoutes); // ✅ Ensure "/api" is used as prefix


// 📌 GET all messages
app.get("/api/chat", async (req, res) => {
  try {
    const messages = await Contact.find();
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 📌 POST a new message (User sends a message)
app.post("/api/chat", async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    if (!fullName || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newMessage = new Contact({ fullName, email, message });
    await newMessage.save();
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.patch("/api/applications/reject/:applicationId", async (req, res) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findByIdAndUpdate(applicationId, { status: "Rejected" });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).json({ message: "Application rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 📌 POST a reply (Admin replies to a message)
app.post("/api/chat/reply", async (req, res) => {
  try {
    const { messageId, response } = req.body;
    if (!messageId || !response) {
      return res.status(400).json({ error: "Message ID and response are required" });
    }

    const message = await Contact.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    message.response = response;
    await message.save();

    res.json({ success: true, message: "Reply added successfully" });
  } catch (error) {
    console.error("Error replying to message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Get applications for the logged-in user
app.get('/api/applications', verifyToken, async (req, res) => {
  try {
    const applications = await Application.find({ email: req.user.email }).select(
      'fullName email message aptitudeLink interviewLink isApproved'
    );
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications' });
  }
});

// Approve an application
app.put('/api/applications/approve/:id', async (req, res) => {
  try {
    await Application.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: 'Application approved' });
  } catch (error) {
    res.status(500).json({ message: 'Error approving application' });
  }
});

// Reject an application
app.put('/api/applications/reject/:id', async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application rejected' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting application' });
  }
});



// Route to fetch users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find(); // Assuming you have a User model
    res.json(users); // Respond with the users
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});
app.post("/api/chats/:id/send", async (req, res) => {
  const { id } = req.params;
  const { message, sender } = req.body;

  const chat = await Chat.findById(id);
  chat.messages.push({ sender, text: message });
  await chat.save();

  res.json(chat); // Send the updated chat with the new message
});


app.post("/api/chats", (req, res) => {
  const { message } = req.body;
  // Create a new chat and save it in the database
  const newChat = createNewChat(message);
  res.status(201).json(newChat);
});
app.get("/api/chats/:id", (req, res) => {
  const { id } = req.params;
  const chat = getChatById(id);
  res.json(chat);
});

// Use the dashboard route
app.use('/api', dashboardRoute);
// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// MongoDB Connection
mongoose
  .connect('mongodb+srv://placement:dUVmdI40hvFvbSXN@cluster0.bdj3q.mongodb.net/careerhub?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));



// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extract the token

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = user; // Decoded user info
    next(); // Pass the request to the next middleware or route handler
  });
};
app.get("/api/stats", async (req, res) => {
  try {
    const stats = {
      totalStudents: 100,
      totalCompanies: 50,
      totalApplications: 200
    };
    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});






// Routes

// Student Routes
app.post('/api/students', async (req, res) => {
  const { name, email, course } = req.body;

  try {
    const newStudent = new Student({ name, email, course });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully!' });
  } catch (error) {
    console.error('Error saving student:', error);
    res.status(500).json({ message: 'Failed to add student' });
  }
});

// Contact Routes
app.post('/api/contact', async (req, res) => {
  const { fullName, email, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newMessage = new Contact({ fullName, email, message });
    await newMessage.save();
    res.status(201).json({
      messageId: newMessage._id,
      message: 'Your message has been sent successfully!',
    });
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ message: 'Failed to send the message.' });
  }
});

app.get('/api/contact/responses/:messageId', async (req, res) => {
  const { messageId } = req.params;

  try {
    const message = await Contact.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({
      response: message.response,
      createdAt: message.createdAt,
    });
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ message: 'Failed to fetch the message.' });
  }
});

// Job Routes
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json({ jobs });
  } catch (err) {
    console.error('Error fetching jobs:', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

app.post('/api/jobs', async (req, res) => {
  const { title, description, requiredSkills, status } = req.body;

  try {
    const newJob = new Job({
      title,
      description,
      requiredSkills,
      status,
      companyId: 'default-company-id',
    });
    await newJob.save();
    res.status(201).json({ newJob });
  } catch (err) {
    console.error('Error saving job:', err);
    res.status(500).json({ message: 'Failed to save job.' });
  }
});

app.put('/api/jobs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedJob) return res.status(404).json({ message: 'Job not found' });
    res.json(updatedJob);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/jobs/:jobId', async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ message: "Job deleted successfully!" });
  } catch (error) {
    console.error("Error deleting job:", error);
    res.status(500).json({ message: "Failed to delete job" });
  }
});

// Application Routes
app.post('/api/applications', upload.single('resume'), async (req, res) => {
  const {
    fullName,
    email,
    phone,
    dob,
    gender,
    address,
    city,
    state,
    zipCode,
    highestQualification,
    yearsOfExperience,
    coverLetter,
    linkedIn,
    skills,
    jobId,
  } = req.body;

  if (!req.file || !fullName || !email || !phone || !dob || !gender || !address || !city || !state || !zipCode || !highestQualification || !yearsOfExperience || !coverLetter || !linkedIn || !skills || !jobId) {
    return res.status(400).json({ message: 'All fields and resume are required.' });
  }

  try {
    const applicationData = {
      fullName,
      email,
      phone,
      dob,
      gender,
      address,
      city,
      state,
      zipCode,
      highestQualification,
      yearsOfExperience,
      resume: req.file.path,
      coverLetter,
      linkedIn,
      skills,
      jobId,
    };

    const newApplication = new Application(applicationData);
    await newApplication.save();
    res.status(201).json({ success: true, message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Error saving application:', err);
    res.status(500).json({ message: 'Error submitting application' });
  }
});

// User Schema and Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


// Routes
app.post('/api/register', async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  if (!firstname || !lastname || !email || !password || !role) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Test Route
app.get('/', (req, res) => {
  res.send('Welcome to the CareerHub API!');
});

app.get('/api/applications/:jobId', async (req, res) => {
  const { jobId } = req.params;

  try {
    // Fetch applications for the given jobId
    const applications = await Application.find({ jobId })
      .populate('jobId', 'title companyName')
      .exec();

    if (!applications || applications.length === 0) {
      return res.status(404).json({ message: 'No applications found for this job.' });
    }

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: 'Error fetching applications.' });
  }
});
// Routes
app.get("/api/applications/student/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const applications = await Application.find({ studentEmail: email });
    res.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get('/api/applications', authenticateToken, async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id });
    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Example protected route
app.get("/api/user", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// Endpoint for fetching approved applications
app.get('/api/applications/approved', async (req, res) => {
  try {
    // Assuming "approved" is a status field in the Application model
    const approvedApplications = await Application.find({ status: 'approved' });

    if (approvedApplications.length === 0) {
      return res.status(404).json({ message: 'No approved applications found' });
    }

    res.json({ applications: approvedApplications });
  } catch (error) {
    console.error('Error fetching approved applications:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Start the Server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
