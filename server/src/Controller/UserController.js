const bcrypt = require("bcrypt");
const prisma = require("../lib/prisma");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const LoginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const isPasswordValid = await bcrypt.compare(
      password.toString(),
      user.password
    );
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      { id: user.id, isAdmin: false },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: age,
      }
    );
    const { password: userPassword, ...infoUser } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        maxAge: age,
      })
      .status(200)
      .json({ infoUser, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to Login" });
  }
};

const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const checkEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (checkEmail)
      return res.status(201).json({ message: "Email da ton tai" });
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const Log0utUser = (req, res) => {
  res
    .clearCookie("SessionToken")
    .status(200)
    .json({ message: "Logout success" });
};

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ message: "get-all successfully", data: users });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to getUsers" });
  }
};

const getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const getUser = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json({ message: "get-user successfully", data: getUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to getUser" });
  }
};

const UpdateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.userId;
    const { username, email, password, avatar } = req.body;
    if (id !== tokenUserId) {
      return res.status(403).json({ message: "Failed id" });
    }
    let updatePassword;
    if (updatePassword) {
      updatePassword = await bcrypt.hash(password, 10);
    }
    const updateUser = await prisma.user.update({
      where: { id },
      data: { username, email, password: updatePassword, avatar },
    });
    if (updateUser)
      return res
        .status(200)
        .json({ message: "update user successfully", data: updateUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to UpdateUser" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const tokenUserId = req.userId;
    if (id !== tokenUserId) {
      return res.status(403).json({ message: "Failed id" });
    }
    const deleteUser = await prisma.user.delete({
      where: { id },
    });
    if (deleteUser)
      return res.status(200).json({ message: "delete user successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to deleteUser" });
  }
};
module.exports = {
  LoginUser,
  Register,
  Log0utUser,
  getUsers,
  getUser,
  UpdateUser,
  deleteUser,
};
