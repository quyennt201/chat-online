import User from "../models/user.model.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exitedUser = await User.findOne({ username });
    if (exitedUser) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      avatar: null,
      email: null
    });

    const token = jwt.sign(
      {
        userId: user.id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const { password: _, ...userData } = user.toObject();
    res
      .status(201)
      .json({
        message: "Register success",
        user: userData,
        accessToken: token,
      });
  } catch (err) {
    res.status(500).json({ message: "An error occur" });
  }
};

export const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exitedUser = await User.findOne({ username }).select('+password');

    if (!exitedUser) {
      return res.status(400).json({ message: "User not exist" });
    }

    const isMatch = await bcrypt.compare(password, exitedUser.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Password is invalid" });
    }

    const token = jwt.sign(
      {
        userId: exitedUser.id.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    const { password: _, ...userData } = exitedUser.toObject();

    res.json({
      message: "Login success",
      accessToken: token,
      user: userData,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: "An error occur" });
  }
};
