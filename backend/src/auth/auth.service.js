import crypto from "crypto";

import { User } from "./user.schema.js";

export class AuthService {
  hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");

    const hash = crypto
      .scryptSync(password, salt, 64)
      .toString("hex");

    return `${salt}:${hash}`;
  }

  verifyPassword(password, storedPassword) {
    const [salt, storedHash] = storedPassword.split(":");

    if (!salt || !storedHash) {
      return false;
    }

    const hash = crypto
      .scryptSync(password, salt, 64)
      .toString("hex");

    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(storedHash, "hex")
    );
  }

  async register(userData) {
    const {
      name,
      email,
      password,
      username = "",
      title = "Workspace member",
    } = userData;

    if (!name || !email || !password) {
      throw new Error("Name, email and password are required");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      throw new Error(
        "An account with this email already exists"
      );
    }

    const hashedPassword = this.hashPassword(password);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      username: username.trim(),
      title: title.trim(),
    });

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      title: user.title,
    };
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const passwordValid = this.verifyPassword(
      password,
      user.password
    );

    if (!passwordValid) {
      throw new Error("Invalid email or password");
    }

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      title: user.title,
    };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select(
      "-password"
    );

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateProfile(userId, profileData) {
    const allowedFields = [
      "name",
      "username",
      "title",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (profileData[field] !== undefined) {
        updates[field] = profileData[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async getUsers() {
    return await User.find(
      {},
      {
        password: 0,
      }
    );
  }
}