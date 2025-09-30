import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import AppError from "../utils/error.util.js";
import sendEmail from "../utils/sendEmail.js";

export const contactUs = asyncHandler(async (req, res, next) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return next(new AppError("All fields are required", 400));
  }

  try {
    const subject = "Contact Us Form";
    const text = `${name} - ${email} <br /> ${message}`;
    await sendEmail(process.env.CONTACT_US_EMAIL, subject, text);
  } catch (error) {
    return next(new AppError(error.message, 500));
  }

  res.status(200).json({
    success: true,
    message: "Your query has been submitted successfully",
  });
});