import User from "../models/userModel.js";
import Directory from "../models/directoryModel.js";
import File from "../models/fileModel.js";

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDirectories = await Directory.countDocuments();
    const totalFiles = await File.countDocuments();

    res.json({
      totalUsers,
      totalDirectories,
      totalFiles,
    });
  } catch (error) {
    next(error);
  }
};