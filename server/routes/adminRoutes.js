const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const Payment = require("../models/Payment");
const { authenticate, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../utils/upload");
const Enrollment = require("../models/Enrollment");

// Middleware: Authentication & Admin Role Restriction
router.use(authenticate);
router.use(restrictTo("admin"));

// ✅ GET /admin/users - Fetch all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /admin/reports - Generate reports
router.get("/reports", async (req, res) => {
  try {
    // Fetch all payments
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("enrollment", "course status");

    // Fetch all enrollments
    const enrollments = await Enrollment.find().populate("course", "title");

    // Calculate total revenue
    const totalRevenue = payments
      .filter((payment) => payment.status === "completed")
      .reduce((sum, payment) => sum + payment.amount, 0);

    // Calculate total enrollments
    const totalEnrollments = enrollments.length;

    // Calculate course-wise revenue
    const courseRevenue = {};
    payments
      .filter((payment) => payment.status === "completed")
      .forEach((payment) => {
        const courseTitle = payment.enrollment.course.title;
        if (!courseRevenue[courseTitle]) {
          courseRevenue[courseTitle] = 0;
        }
        courseRevenue[courseTitle] += payment.amount;
      });

    // Calculate payment status distribution
    const paymentStatusDistribution = {
      pending: payments.filter((payment) => payment.status === "pending")
        .length,
      completed: payments.filter((payment) => payment.status === "completed")
        .length,
      failed: payments.filter((payment) => payment.status === "failed").length,
    };

    // Calculate user-wise payments
    const userPayments = {};
    payments.forEach((payment) => {
      const userName = payment.user.name;
      if (!userPayments[userName]) {
        userPayments[userName] = {
          totalPayments: 0,
          totalAmount: 0,
        };
      }
      userPayments[userName].totalPayments += 1;
      userPayments[userName].totalAmount += payment.amount;
    });

    // Calculate total discounts applied
    const totalDiscounts = payments.reduce((sum, payment) => {
      if (payment.discountCode) {
        return sum + 1;
      }
      return sum;
    }, 0);

    // Compile the report
    const report = {
      totalRevenue,
      totalEnrollments,
      courseRevenue,
      paymentStatusDistribution,
      userPayments,
      totalDiscounts,
    };

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /admin/payments - Fetch all payments
router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email") // Populate user details
      .populate("enrollment", "course status"); // Populate enrollment details

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /admin/instructors - Fetch all instructors
router.get("/instructors", async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select(
      "-password"
    ); // Exclude password field
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST /admin/courses - Add a new course
router.post("/courses", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      instructors,
      schedule,
      fees,
      maxParticipants,
      category,
      prerequisites,
      courseLevel,
      courseDuration,
      courseType,
    } = req.body;

    // Required Fields Validation
    if (
      !title ||
      !description ||
      !schedule ||
      !fees ||
      !maxParticipants ||
      !category ||
      !courseLevel ||
      !courseDuration ||
      !courseType
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // ✅ Ensure `instructors` is an array & Convert to ObjectId
    if (!Array.isArray(instructors) || instructors.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one instructor ID is required." });
    }

    const instructorIds = instructors.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    // ✅ Fetch and validate instructors
    const instructorUsers = await User.find({
      _id: { $in: instructorIds },
      role: "instructor",
    }).lean();

    if (instructorUsers.length !== instructorIds.length) {
      return res.status(400).json({
        message:
          "Some instructor IDs are invalid or do not have the instructor role.",
      });
    }

    // ✅ Validate Image Upload
    if (!req.file) {
      return res.status(400).json({ message: "Course image is required." });
    }

    // ✅ Convert `schedule` to a Date object
    const parsedSchedule = new Date(schedule);
    if (isNaN(parsedSchedule.getTime())) {
      return res.status(400).json({ message: "Invalid schedule date format." });
    }

    // ✅ Create and Save Course
    const course = new Course({
      title: title.trim(),
      description: description.trim(),
      instructors: instructorIds, // Store ObjectId references
      schedule: parsedSchedule,
      fees,
      maxParticipants,
      category: category.trim(),
      prerequisites: Array.isArray(prerequisites)
        ? prerequisites.map((p) => p.trim())
        : [],
      courseLevel, // Added new field
      courseDuration, // Added new field
      courseType, // Added new field
      image: req.file.filename, // Save image filename
    });

    await course.save();
    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    console.error("Error creating course:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// ✅ GET /admin/courses - Fetch all courses
router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructors", "name email") // Populate instructor details
      .populate("enrolledStudents", "name email") // Populate enrolled students
      .populate("waitlist", "name email"); // Populate waitlisted students

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ GET /admin/courses/:id/enrolled - Fetch enrolled students for a course
router.get("/courses/:id/enrolled", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "enrolledStudents",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course.enrolledStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ PUT /admin/courses/:id - Update a course
router.put("/courses/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // ✅ Validate `instructors` if provided in updates
    if (updates.instructors) {
      const instructorIds = updates.instructors.map(
        (id) => new mongoose.Types.ObjectId(id)
      );
      const instructorUsers = await User.find({
        _id: { $in: instructorIds },
        role: "instructor",
      }).lean();

      if (instructorUsers.length !== instructorIds.length) {
        return res.status(400).json({ message: "Invalid instructor IDs" });
      }

      updates.instructors = instructorIds;
    }

    // ✅ Update Image if provided
    if (req.file) {
      updates.image = req.file.filename;
    }

    // ✅ Convert `schedule` to Date if provided
    if (updates.schedule) {
      const parsedSchedule = new Date(updates.schedule);
      if (isNaN(parsedSchedule.getTime())) {
        return res
          .status(400)
          .json({ message: "Invalid schedule date format." });
      }
      updates.schedule = parsedSchedule;
    }

    // ✅ Trim strings
    if (updates.title) updates.title = updates.title.trim();
    if (updates.description) updates.description = updates.description.trim();
    if (updates.category) updates.category = updates.category.trim();
    if (updates.prerequisites) {
      updates.prerequisites = updates.prerequisites.map((p) => p.trim());
    }

    // ✅ Validate new fields if provided
    if (
      updates.courseLevel &&
      !["beginner", "intermediate", "advanced"].includes(updates.courseLevel)
    ) {
      return res.status(400).json({ message: "Invalid course level." });
    }

    if (
      updates.courseType &&
      !["live", "self-paced", "hybrid"].includes(updates.courseType)
    ) {
      return res.status(400).json({ message: "Invalid course type." });
    }

    const course = await Course.findByIdAndUpdate(id, updates, { new: true });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ DELETE /admin/courses/:id - Delete a course
router.delete("/courses/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
