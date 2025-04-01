const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Exam = require("../models/Exam");
const Session = require("../models/Session");
const Certificate = require("../models/Certificate");
const Course = require("../models/Course");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticate, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

// Register a new student
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      dateOfBirth,
      gender,
      nationality,
      languageProficiency,
    } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !gender ||
      !nationality ||
      !languageProficiency
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create a new student
    const user = new User({
      name,
      email,
      password,
      phone,
      address,
      dateOfBirth,
      gender,
      nationality,
      languageProficiency,
      role: "student", // Default role
      image: req.file ? req.file.path : null, // Store the image path if uploaded
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login for all users
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email, isActive: true });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update user profile (only for logged-in users)
router.put(
  "/profile",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    try {
      const updates = req.body;

      // Validate gender if provided
      if (
        updates.gender &&
        !["male", "female", "other"].includes(updates.gender)
      ) {
        return res.status(400).json({ message: "Invalid gender value." });
      }

      // Update image if provided
      if (req.file) {
        updates.image = req.file.filename; // Save only the image name
      }

      // Trim strings
      if (updates.name) updates.name = updates.name.trim();
      if (updates.email) updates.email = updates.email.trim();
      if (updates.phone) updates.phone = updates.phone.trim();
      if (updates.address) updates.address = updates.address.trim();
      if (updates.nationality) updates.nationality = updates.nationality.trim();
      if (updates.languageProficiency) {
        updates.languageProficiency = updates.languageProficiency.map((lang) =>
          lang.trim()
        );
      }

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
      }).select("-password");

      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Admin and Instructor: Get own profile
router.get(
  "/admin/profile",
  authenticate,
  restrictTo("admin", "instructor"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Admin and Instructor: Update own profile
router.put(
  "/admin/profile",
  authenticate,
  restrictTo("admin", "instructor"),
  upload.single("image"),
  async (req, res) => {
    try {
      const updates = req.body;

      // Validate gender if provided
      if (
        updates.gender &&
        !["male", "female", "other"].includes(updates.gender)
      ) {
        return res.status(400).json({ message: "Invalid gender value." });
      }

      // Update image if provided
      if (req.file) {
        updates.image = req.file.filename; // Save only the image name
      }

      // Trim strings
      if (updates.name) updates.name = updates.name.trim();
      if (updates.email) updates.email = updates.email.trim();
      if (updates.phone) updates.phone = updates.phone.trim();
      if (updates.address) updates.address = updates.address.trim();
      if (updates.nationality) updates.nationality = updates.nationality.trim();
      if (updates.languageProficiency) {
        updates.languageProficiency = updates.languageProficiency.map((lang) =>
          lang.trim()
        );
      }

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
      }).select("-password");

      res.json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Admin: Add a new instructor
router.post(
  "/admin/instructors",
  authenticate,
  restrictTo("admin"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        phone,
        address,
        dateOfBirth,
        gender,
        nationality,
        languageProficiency,
      } = req.body;

      // Check if the email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Validate required fields
      if (
        !name ||
        !email ||
        !password ||
        !gender ||
        !nationality ||
        !languageProficiency
      ) {
        return res
          .status(400)
          .json({ message: "All required fields must be provided." });
      }

      // Create a new instructor
      const instructor = new User({
        name,
        email,
        password,
        phone,
        address,
        dateOfBirth,
        gender,
        nationality,
        languageProficiency,
        role: "instructor", // Set role to instructor
      });

      await instructor.save();

      res
        .status(201)
        .json({ message: "Instructor created successfully", instructor });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get exams for the currently logged-in student (only accessible to students)
router.get(
  "/student/exams",
  authenticate,
  restrictTo("student"), // Only students can access this route
  async (req, res) => {
    try {
      const studentId = req.user._id; // Get the logged-in student's ID from the token

      const exams = await Exam.find({ student: studentId })
        .populate("course", "name code") // Include course details
        .populate("markedBy", "name") // Include who marked the exam
        .sort({ examDate: -1 }); // Sort by exam date (newest first)

      res.json(exams);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// (Optional) Filter exams for the logged-in student
router.get(
  "/student/exams/filtered",
  authenticate,
  restrictTo("student"),
  async (req, res) => {
    try {
      const studentId = req.user._id;
      const { examType, status, course } = req.query;

      const filter = { student: studentId };

      if (examType) filter.examType = examType;
      if (status) filter.status = status;
      if (course) filter.course = course;

      const exams = await Exam.find(filter)
        .populate("course", "name code")
        .populate("markedBy", "name")
        .sort({ examDate: -1 });

      res.json(exams);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// Get sessions for logged-in student's enrolled courses
router.get(
  "/student/my-sessions",
  authenticate,
  restrictTo("student"),
  async (req, res) => {
    try {
      // Step 1: Find all courses where the student is enrolled with basic info
      const courses = await Course.find({
        enrolledStudents: req.user._id,
        isActive: true,
      }).select("_id title code");

      if (courses.length === 0) {
        return res.json({
          upcoming: [],
          past: [],
          courses: [],
        });
      }

      const courseIds = courses.map((c) => c._id);
      const now = new Date();

      // Step 2: Get all sessions for these courses in a single query
      const allSessions = await Session.find({
        course: { $in: courseIds },
      })
        .populate({
          path: "course",
          select: "title code category",
        })
        .populate({
          path: "createdBy",
          select: "name email profilePicture",
        })
        .sort({ sessionDate: 1 }); // Sort chronologically

      // Categorize sessions
      const upcomingSessions = allSessions.filter(
        (s) => new Date(s.sessionDate) > now
      );
      const pastSessions = allSessions.filter(
        (s) => new Date(s.sessionDate) <= now
      );

      // Format response data
      const response = {
        upcoming: upcomingSessions.map((session) => ({
          _id: session._id,
          title: session.title,
          description: session.description,
          sessionDate: session.sessionDate,
          sessionType: session.sessionType,
          duration: session.sessionDuration,
          course: {
            _id: session.course._id,
            title: session.course.title,
            code: session.course.code,
          },
          instructor: session.createdBy,
          joinLink:
            session.sessionType === "live" ? session.googleMeetLink : null,
          recordingLink:
            session.sessionType === "recorded" ? session.recordingLink : null,
          status: "upcoming",
        })),
        past: pastSessions.map((session) => ({
          _id: session._id,
          title: session.title,
          description: session.description,
          sessionDate: session.sessionDate,
          sessionType: session.sessionType,
          duration: session.sessionDuration,
          course: {
            _id: session.course._id,
            title: session.course.title,
            code: session.course.code,
          },
          instructor: session.createdBy,
          recordingLink:
            session.recordingLink ||
            (session.sessionType === "live" ? session.googleMeetLink : null),
          status: "completed",
        })),
        courses: courses.map((c) => ({
          _id: c._id,
          title: c.title,
          code: c.code,
        })),
        stats: {
          total: allSessions.length,
          upcoming: upcomingSessions.length,
          completed: pastSessions.length,
        },
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching student sessions:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch learning sessions",
        error: error.message,
      });
    }
  }
);

router.get("/certificate/:certificateId", authenticate, async (req, res) => {
  try {
    const { certificateId } = req.params;
    const studentId = req.user._id;

    // Find the certificate
    const certificate = await Certificate.findOne({
      _id: certificateId,
      student: studentId,
    })
      .populate("student", "name email")
      .populate("course", "title description courseLevel");

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({
      studentName: certificate.student.name,
      studentEmail: certificate.student.email,
      courseTitle: certificate.course.title,
      courseDescription: certificate.course.description,
      courseLevel: certificate.course.courseLevel,
      issueDate: certificate.issueDate,
      certificateId: certificate.certificateId,
      certificateType: certificate.certificateType,
      validityPeriod: certificate.validityPeriod,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
