const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const Resource = require("../models/Resource");
const Attendance = require("../models/Attendance");
const Exam = require("../models/Exam");
const Session = require("../models/Session");
const Certificate = require("../models/Certificate");
const { authenticate, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");

// Middleware: Authentication & Instructor Role Restriction
router.use(authenticate);
router.use(restrictTo("instructor"));

// ✅ GET /instructor/courses - Fetch all courses taught by the instructor
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find({ instructors: req.user._id })
      .populate("enrolledStudents", "name email")
      .select("-waitlist");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/students/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    // Find the course and populate enrolled students
    const course = await Course.findById(courseId).populate(
      "enrolledStudents",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json(course.enrolledStudents);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Server error" });
  }
});
const { Types } = require("mongoose");

// ✅ POST /instructor/sessions - Create a session for a course
router.post(
  "/sessions",
  authenticate,
  restrictTo("instructor"),
  async (req, res) => {
    try {
      const {
        courseId,
        sessionDate,
        sessionType,
        sessionDuration,
        title,
        description,
        googleMeetLink,
        recordingLink,
      } = req.body;

      // Validate required fields
      if (
        !courseId ||
        !sessionDate ||
        !sessionType ||
        !sessionDuration ||
        !title
      ) {
        return res
          .status(400)
          .json({ message: "All required fields must be provided" });
      }

      // Validate course exists and instructor teaches it
      const course = await Course.findOne({
        _id: courseId,
        instructors: req.user._id,
      });

      if (!course) {
        return res.status(403).json({
          message: "You are not authorized to create sessions for this course",
        });
      }

      // Validate Google Meet link for live sessions
      if (sessionType === "live" && !googleMeetLink) {
        return res
          .status(400)
          .json({ message: "Google Meet link is required for live sessions" });
      }

      if (
        googleMeetLink &&
        !/^https?:\/\/(meet\.google\.com|www\.google\.com\/meet)\/.+/.test(
          googleMeetLink
        )
      ) {
        return res
          .status(400)
          .json({ message: "Invalid Google Meet URL format" });
      }

      // Validate recording link if provided
      if (recordingLink && !/^https?:\/\/.+/.test(recordingLink)) {
        return res
          .status(400)
          .json({ message: "Invalid recording URL format" });
      }

      const session = new Session({
        course: courseId,
        sessionDate,
        sessionType,
        sessionDuration,
        title,
        description,
        googleMeetLink: sessionType === "live" ? googleMeetLink : undefined,
        recordingLink: sessionType === "recorded" ? recordingLink : undefined,
        createdBy: req.user._id,
      });

      await session.save();

      // Populate course details in response
      const populatedSession = await Session.findById(session._id)
        .populate("course", "title code")
        .populate("createdBy", "name email");

      res.status(201).json({
        message: "Session created successfully",
        session: populatedSession,
      });
    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).json({
        message: "Failed to create session",
        error: error.message,
      });
    }
  }
);

// ✅ GET /instructor/sessions/:courseId - Fetch all sessions for a course
router.get(
  "/sessions/:courseId",
  authenticate,
  restrictTo("instructor"),
  async (req, res) => {
    try {
      // Verify instructor teaches this course
      const course = await Course.findOne({
        _id: req.params.courseId,
        instructors: req.user._id,
      });

      if (!course) {
        return res.status(403).json({
          message: "You are not authorized to view sessions for this course",
        });
      }

      const sessions = await Session.find({ course: req.params.courseId })
        .populate("course", "title code")
        .populate("createdBy", "name")
        .sort({ sessionDate: -1 }); // Sort by newest first

      // Format dates and add status (upcoming/past)
      const formattedSessions = sessions.map((session) => ({
        ...session.toObject(),
        status:
          new Date(session.sessionDate) > new Date() ? "upcoming" : "completed",
        formattedDate: session.sessionDate.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }));

      res.json(formattedSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({
        message: "Failed to fetch sessions",
        error: error.message,
      });
    }
  }
);

// ✅ POST /instructor/attendance - Mark attendance for a session
router.post("/attendance", async (req, res) => {
  try {
    const { sessionId, studentId, status } = req.body;

    if (!sessionId || !studentId || !status) {
      return res
        .status(400)
        .json({ message: "Session ID, Student ID, and status are required" });
    }

    const attendance = new Attendance({
      student: studentId,
      session: sessionId,
      status,
      markedBy: req.user._id,
    });

    await attendance.save();
    res
      .status(201)
      .json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /instructor/attendance/:sessionId - Fetch attendance for a session
router.get("/attendance/:sessionId", async (req, res) => {
  try {
    const attendance = await Attendance.find({ session: req.params.sessionId })
      .populate("student", "name email")
      .select("-markedBy");
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /instructor/courses/resources?courseId=:id - Get all resources for a course
router.get("/courses/resources", async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    const resources = await Resource.find({ course: courseId })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ resources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST /instructor/courses/resources - Add resources to a course
router.post("/courses/resources", upload.single("file"), async (req, res) => {
  try {
    const { title, description, resourceType, resourceCategory, courseId } = req.body;

    // Validate required fields
    if (!req.file || !title || !description || !resourceType || !resourceCategory || !courseId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate resourceType and resourceCategory against enum values
    const validResourceTypes = ["video", "pdf", "quiz", "assignment"];
    const validCategories = ["safety", "hospitality", "grooming"];

    if (!validResourceTypes.includes(resourceType)) {
      return res.status(400).json({ message: "Invalid resource type" });
    }

    if (!validCategories.includes(resourceCategory)) {
      return res.status(400).json({ message: "Invalid resource category" });
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" });
    }

    const resource = new Resource({
      title,
      description,
      fileUrl: req.file.path, // Store full path or filename as per your config
      uploadedBy: req.user._id,
      course: courseId,
      resourceType,
      resourceCategory
    });

    await resource.save();
    
    // Populate uploadedBy in the response
    const populatedResource = await Resource.findById(resource._id).populate("uploadedBy", "name email");
    
    res.status(201).json({ 
      message: "Resource added successfully", 
      resource: populatedResource 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ PATCH /instructor/resources/:id/increment-download - Increment download count
router.patch("/resources/:id/increment-download", async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    ).populate("uploadedBy", "name email");

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json({ resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST /instructor/courses/:id/attendance - Mark attendance for a session
router.post("/courses/:id/attendance", async (req, res) => {
  try {
    const { studentId, sessionDate, status, sessionType, sessionDuration } =
      req.body;

    const attendance = new Attendance({
      student: studentId,
      course: req.params.id,
      sessionDate,
      status,
      markedBy: req.user._id,
      sessionType,
      sessionDuration,
    });

    await attendance.save();
    res
      .status(201)
      .json({ message: "Attendance marked successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create an Exam
router.post("/courses/exams", async (req, res) => {
  try {
    const {
      course, // Get course ID from the form body
      student,
      examType,
      googleFormLink,
      googleFormResponseId,
      totalMarks,
      passingPercentage,
      examDate,
    } = req.body;

    // Validate that course ID is provided
    if (!course) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const exam = new Exam({
      course: course, // Use course ID from the body
      student,
      examType,
      googleFormLink,
      googleFormResponseId,
      totalMarks,
      passingPercentage,
      examDate,
    });

    await exam.save();
    res.status(201).json({ message: "Exam created successfully", exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Exams for a Course
router.get("/courses/exams", async (req, res) => {
  try {
    const { course } = req.query; // Get course ID from query parameters

    if (!course) {
      return res.status(400).json({ message: "Course ID is required" });
    }

    const exams = await Exam.find({ course: course }).populate(
      "student",
      "name email"
    );
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Exam Details
router.get("/exams/:id", async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      "student",
      "name email"
    );
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an Exam
router.put("/exams/:id", async (req, res) => {
  try {
    const updateFields = req.body;
    const exam = await Exam.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
    });
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Exam updated successfully", exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an Exam
router.delete("/courses/exams/:id", async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Grade an Exam
router.put("/exams/:id/grade", async (req, res) => {
  try {
    const { score, markedBy } = req.body;
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: "Exam not found" });
    if (score > exam.totalMarks)
      return res
        .status(400)
        .json({ message: "Score cannot exceed total marks" });
    exam.score = score;
    exam.markedBy = markedBy;
    await exam.save();
    res.json({ message: "Exam graded successfully", exam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST /instructor/certificates - Issue a certificate to a student
router.post("/certificates", async (req, res) => {
  try {
    const { student, course, certificateType, validityPeriod } = req.body;

    // Validate ObjectIds
    if (
      !mongoose.Types.ObjectId.isValid(student) ||
      !mongoose.Types.ObjectId.isValid(course)
    ) {
      return res.status(400).json({ message: "Invalid student or course ID" });
    }

    // Check if student and course exist
    const [existingStudent, existingCourse] = await Promise.all([
      User.findById(student),
      Course.findById(course),
    ]);

    if (!existingStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Validate certificate type
    const validCertificateTypes = ["completion", "excellence"];
    if (!validCertificateTypes.includes(certificateType)) {
      return res.status(400).json({ message: "Invalid certificate type" });
    }

    // Check if a certificate already exists for the same student and course
    const existingCertificate = await Certificate.findOne({
      student,
      course,
    });

    if (existingCertificate) {
      return res.status(400).json({
        message:
          "A certificate has already been issued to this student for the selected course",
      });
    }

    // Generate a unique certificate ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    const certificateId = `CERT-${student}-${course}-${Date.now()}-${randomSuffix}`;

    // Create and save the certificate
    const certificate = new Certificate({
      student,
      course,
      certificateId,
      certificateType,
      validityPeriod,
      issueDate: new Date(), // Explicitly set issue date
    });

    await certificate.save();
    res
      .status(201)
      .json({ message: "Certificate issued successfully", certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /instructor/certificates - Fetch all issued certificates
router.get("/certificates", async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("student", "name email")
      .populate("course", "title");
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /instructor/certificates/:id - Fetch a specific certificate by ID
router.get("/certificates/:id", async (req, res) => {
  try {
    validateObjectId(req.params.id);

    const certificate = await Certificate.findById(req.params.id)
      .populate("student", "name email")
      .populate("course", "title");

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ DELETE /instructor/certificates/:id - Revoke/Delete a certificate
router.delete("/certificates/:id", async (req, res) => {
  try {
    validateObjectId(req.params.id);

    const certificate = await Certificate.findByIdAndDelete(req.params.id);
    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.json({ message: "Certificate revoked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /validate/certificate/:certificateId - Validate a certificate
router.get("/validate/certificate/:certificateId", async (req, res) => {
  try {
    const certificate = await Certificate.findOne({
      certificateId: req.params.certificateId,
    })
      .populate("student", "name email")
      .populate("course", "title");

    if (!certificate) {
      return res.status(404).json({ message: "Invalid certificate ID" });
    }

    res.json({ valid: true, certificate });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
