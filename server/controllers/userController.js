import Directory from "../models/directoryModel.js";
import User from "../models/userModel.js";
import Otp from "../models/otpModel.js";
import Session from "../models/sessionModel.js";
import mongoose, { Types } from "mongoose";
import { sendOtpEmail } from "../utils/mailer.js";
import crypto from "crypto";

/* ---------------- REGISTER ---------------- */

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "This email already exists" });
    }

    await Otp.deleteMany({ email });

    const otp = crypto.randomInt(100000, 999999).toString();
    await Otp.create({ email, otp });

    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to your email. Please verify to complete registration.",
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------- VERIFY OTP ---------------- */

export const verifyOtp = async (req, res, next) => {
  const { name, email, password, otp } = req.body;
  const mongoSession = await mongoose.startSession();

  try {
    if (!name || !email || !password || !otp) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    await Otp.deleteMany({ email });

    const rootDirId = new Types.ObjectId();
    const userId = new Types.ObjectId();

    await mongoSession.withTransaction(async () => {
      await Directory.create(
        [
          {
            _id: rootDirId,
            name: `root-${email}`,
            parentDirId: null,
            userId,
          },
        ],
        { session: mongoSession }
      );

      await User.create(
        [
          {
            _id: userId,
            name,
            email,
            password,
            rootDirId,
            role: "user", // important
          },
        ],
        { session: mongoSession }
      );
    });

    res.status(201).json({ message: "User Registered Successfully" });
  } catch (err) {
    next(err);
  } finally {
    mongoSession.endSession();
  }
};

/* ---------------- LOGIN ---------------- */

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(404).json({ error: "Invalid Credentials" });
    }

    const allSessions = await Session.find({ userId: user._id }).sort({
      createdAt: 1,
    });

    if (allSessions.length >= 2) {
      await allSessions[0].deleteOne();
    }

    const session = await Session.create({ userId: user._id });

    res.cookie("sid", session.id, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Logged in" });
  } catch (err) {
    next(err);
  }
};

/* ---------------- CURRENT USER ---------------- */

export const getCurrentUser = (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

/* ---------------- GET ALL USERS ---------------- */

export const getAllUser = async (req, res, next) => {
  try {
    const allUsers = await User.find().lean();
    const allSessions = await Session.find().lean();

    const sessionUserIds = allSessions.map((s) =>
      s.userId.toString()
    );

    const loggedInSet = new Set(sessionUserIds);

    const transformedUsers = allUsers.map(({ _id, name, email }) => ({
      id: _id,
      name,
      email,
      isLoggedIn: loggedInSet.has(_id.toString()),
    }));

    res.status(200).json(transformedUsers);
  } catch (err) {
    next(err);
  }
};

/* ---------------- ADMIN STATS ---------------- */

export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const uniqueUsers = await Session.distinct("userId");
    const totalActiveSessions = await Session.countDocuments();

    res.json({
      totalUsers,
      loggedInUsers: uniqueUsers.length,
      totalActiveSessions,
    });
  } catch (err) {
    next(err);
  }
};

/* ---------------- LOGOUT ---------------- */

export const logout = async (req, res, next) => {
  try {
    const { sid } = req.signedCookies;

    await Session.findByIdAndDelete(sid);

    res.clearCookie("sid");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

/* ---------------- LOGOUT ALL ---------------- */

export const logoutAll = async (req, res, next) => {
  try {
    const { sid } = req.signedCookies;
    const session = await Session.findById(sid);

    if (!session) {
      res.clearCookie("sid");
      return res.status(401).json({ error: "Session not found" });
    }

    await Session.deleteMany({ userId: session.userId });

    res.clearCookie("sid");
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};