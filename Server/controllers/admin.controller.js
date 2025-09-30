import asyncHandler from "../middlewares/asyncHAndler.middleware.js";
import User from "../models/usermodel.js";

export const getAdminStats = asyncHandler(async (req, res, next) => {
  const allUsersCount = await User.countDocuments();

  const jobSeekersCount = await User.countDocuments({ role: 'JOB_SEEKER' });
  const jobProvidersCount = await User.countDocuments({ role: 'JOB_PROVIDER' });

  res.status(200).json({
    success: true,
    message: "Admin stats",
    allUsersCount,
    jobSeekersCount,
    jobProvidersCount,
  });
});