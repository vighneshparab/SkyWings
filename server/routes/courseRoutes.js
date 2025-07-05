const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51QhsHkBBd5siMmWjEaOkgB23mfV2B1VJXYmGYtLAVlJmqvKfRinICFM5s08hopY7nfY7xmiOnTd0B1KpoMWieQhW00M5WCKwX5"
);
const nodemailer = require("nodemailer");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Resource = require("../models/Resource");
const Feedback = require("../models/Feedback");
const Certificate = require("../models/Certificate");
const Payment = require("../models/Payment");
const { authenticate, restrictTo } = require("../middleware/authMiddleware");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Test the transporter
// transporter.verify(function (error, success) {
//   if (error) {
//     console.error("Error verifying transporter:", error);
//   } else {
//     console.log("Email transporter is ready");
//   }
// });

// ✅ GET /student/courses - Fetch all active courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true })
      .populate("instructors", "name email")
      .select("-enrolledStudents -waitlist");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ Apply Authentication & Restriction Only to /enrolled
router.get(
  "/enrolled",
  authenticate,
  restrictTo("student"),
  async (req, res) => {
    try {
      if (!req.user || !req.user._id) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const userId = new mongoose.Types.ObjectId(req.user._id);

      const enrollments = await Enrollment.find({ student: userId })
        .populate({
          path: "course",
          select: "title description image instructors", // Include instructors field
          populate: {
            path: "instructors", // Populate the instructors field
            model: "User", // Reference the User model
            select: "name email", // Select the fields you want to include
          },
        })
        .select("-student");

      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

// ✅ GET /student/certificates - Fetch all certificates issued to the student
router.get(
  "/certificates",
  authenticate,
  restrictTo("student"),
  async (req, res) => {
    try {
      const certificates = await Certificate.find({ student: req.user._id })
        .populate("course", "title description")
        .select("-student");

      res.json(certificates);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ✅ GET /feedback - Fetch all feedback given by the logged-in user
router.get(
  "/feedback",
  authenticate,
  restrictTo("student"),
  async (req, res) => {
    try {
      const userId = req.user._id;

      // Fetch all feedback given by the user
      const feedbacks = await Feedback.find({ student: userId })
        .populate("course", "title")
        .populate("instructor", "name");

      res.json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// ✅ Public Route: Fetch Course Details Without Authentication
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructors", "name email")
      .select("-enrolledStudents -waitlist");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Middleware: Authentication & Student Role Restriction
router.use(authenticate);
router.use(restrictTo("student"));

// ✅ POST /student/courses/:id/enroll - Enroll in a course (with Stripe payment)
router.post("/:id/enroll", async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user._id;

    // Fetch the course
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: id,
    });
    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Check if the course has available slots
    if (course.enrolledStudents.length >= course.maxParticipants) {
      course.waitlist.push(studentId);
      await course.save();
      return res
        .status(200)
        .json({ message: "Course is full. Added to waitlist." });
    }

    // Create an enrollment record (pending payment)
    const enrollment = new Enrollment({
      student: studentId,
      course: id,
      status: "pending",
      paymentStatus: "unpaid",
    });
    await enrollment.save();

    // Create a Stripe payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: course.fees * 100, // Stripe expects amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });

    // Store payment details
    const payment = new Payment({
      user: studentId,
      enrollment: enrollment._id,
      amount: course.fees,
      currency: "USD",
      paymentMethod: "credit_card",
      transactionId: session.id,
      status: "pending",
    });
    await payment.save();

    console.log("Enrolled successfully"); // Log message for testing
    res.json({ message: "Enrolled successfully", url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ POST /student/payment-success - Handle payment success
router.post("/payment-success", async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    // Retrieve the session details from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not successful" });
    }

    // Find the payment record
    const payment = await Payment.findOne({
      transactionId: session.id,
    }).populate("enrollment");
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }

    // Find the enrollment linked to this payment with proper population
    const enrollment = await Enrollment.findById(payment.enrollment)
      .populate({
        path: "course",
        model: "Course",
      })
      .populate({
        path: "student",
        model: "User",
        select: "name email", // Only select necessary fields
      });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment record not found" });
    }

    // Get the user's email from the populated student data
    const userEmail = enrollment.student.email;

    if (!userEmail) {
      return res.status(404).json({ message: "User email not found" });
    }

    // Find the course linked to this enrollment (already populated)
    const course = enrollment.course;
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update enrollment and payment status
    enrollment.status = "active";
    enrollment.paymentStatus = "paid";
    await enrollment.save();

    payment.status = "completed";
    await payment.save();

    // Add student to course's enrolledStudents if not already there
    if (!course.enrolledStudents.includes(enrollment.student._id)) {
      course.enrolledStudents.push(enrollment.student._id);
      await course.save();
    }

    // Prepare invoice data
    const invoiceData = {
      invoiceId: payment._id,
      date: new Date().toLocaleDateString(),
      student: {
        id: enrollment.student._id,
        name: enrollment.student.name,
        email: userEmail,
      },
      course: {
        id: course._id,
        name: course.title,
        price: course.fees,
      },
      payment: {
        id: payment._id,
        transactionId: payment.transactionId,
        amount: payment.amount,
        status: payment.status,
      },
    };

    // Send email with invoice
    await sendInvoiceEmail(userEmail, invoiceData);

    res.json({
      message:
        "Payment successful, enrollment confirmed. Invoice sent to your email.",
      invoiceData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

async function sendInvoiceEmail(studentEmail, invoiceData) {
  try {
    // Create HTML email template with Tailwind CSS (inline styles)
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Enrollment Confirmation</title>
    </head>
    <body style="font-family: 'Inter', Arial, sans-serif; background-color: #f8fafc;">
      <!-- Email Container -->
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <!-- Header -->
        <div style="background-color: #4f46e5; padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; font-size: 24px; font-weight: 600; margin: 0;">Enrollment Confirmed</h1>
          <p style="color: #e0e7ff; margin-top: 10px; font-size: 16px;">Thank you for joining ${
            invoiceData.course.name
          }</p>
        </div>
        
        <!-- Main Content -->
        <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
          <!-- Greeting -->
          <div style="margin-bottom: 25px;">
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Dear ${
              invoiceData.student.name
            },</p>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">Your enrollment in <strong>${
              invoiceData.course.name
            }</strong> has been confirmed. Below are the details of your transaction:</p>
          </div>
          
          <!-- Invoice Summary -->
          <div style="margin-bottom: 30px; border: 1px solid #e5e7eb; border-radius: 6px; overflow: hidden;">
            <div style="background-color: #f9fafb; padding: 15px 20px; border-bottom: 1px solid #e5e7eb;">
              <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0;">Invoice Summary</h2>
            </div>
            <div style="padding: 20px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280;">Invoice Number</span>
                <span style="color: #111827; font-weight: 500;">#${
                  invoiceData.invoiceId
                }</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280;">Date</span>
                <span style="color: #111827; font-weight: 500;">${new Date().toLocaleDateString(
                  "en-US",
                  { year: "numeric", month: "long", day: "numeric" }
                )}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                <span style="color: #6b7280;">Payment Status</span>
                <span style="color: #10b981; font-weight: 500; text-transform: capitalize;">${
                  invoiceData.payment.status
                }</span>
              </div>
            </div>
          </div>
          
          <!-- Course Details -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Course Details</h3>
            <div style="display: flex; margin-bottom: 20px;">
              <div style="flex: 1;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">Course Name</p>
                <p style="color: #111827; font-weight: 500;">${
                  invoiceData.course.name
                }</p>
              </div>
              <div style="flex: 1;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 5px;">Price</p>
                <p style="color: #111827; font-weight: 500;">$${invoiceData.course.price.toFixed(
                  2
                )}</p>
              </div>
            </div>
          </div>
          
          <!-- Payment Details -->
          <div style="margin-bottom: 30px;">
            <h3 style="color: #111827; font-size: 18px; font-weight: 600; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Payment Details</h3>
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Transaction ID</span>
                <span style="color: #111827; font-weight: 500;">${
                  invoiceData.payment.transactionId
                }</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280;">Amount Paid</span>
                <span style="color: #111827; font-weight: 500;">$${invoiceData.payment.amount.toFixed(
                  2
                )}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #6b7280;">Payment Method</span>
                <span style="color: #111827; font-weight: 500;">Credit Card</span>
              </div>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${
              process.env.CLIENT_URL
            }dashboard" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; font-size: 16px;">Access Your Course</a>
          </div>
          
          <!-- Footer -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">Need help with your course?</p>
            <p style="color: #6b7280; font-size: 14px;">Contact our support team at <a href="mailto:support@yourplatform.com" style="color: #4f46e5; text-decoration: none;">support@yourplatform.com</a></p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">© ${new Date().getFullYear()} Your Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    // Send email
    await transporter.sendMail({
      from: `"Learning Platform" <${process.env.EMAIL_USERNAME}>`,
      to: studentEmail,
      subject: `🎉 Enrollment Confirmation: ${invoiceData.course.name}`,
      html: htmlTemplate,
    });

    console.log(`Invoice email sent to ${studentEmail}`);
  } catch (error) {
    console.error("Failed to send invoice email:", error);
    // Consider logging this error to a monitoring system
  }
}

// ✅ GET /student/courses/:id/resources - Fetch resources for a specific course
router.get("/:id/resources", async (req, res) => {
  try {
    const resources = await Resource.find({ course: req.params.id }).select(
      "-uploadedBy"
    );

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/feedback", authenticate, async (req, res) => {
  try {
    const {
      course,
      instructor,
      courseRating,
      instructorRating,
      comment,
      anonymousFeedback,
      feedbackType,
    } = req.body;

    // Validate required fields
    if (
      !course ||
      !instructor ||
      !courseRating ||
      !instructorRating ||
      !feedbackType
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Create a new feedback
    const feedback = new Feedback({
      student: req.user._id, // Logged-in student
      course,
      instructor,
      courseRating,
      instructorRating,
      comment,
      anonymousFeedback,
      feedbackType,
    });

    await feedback.save();

    res
      .status(201)
      .json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
