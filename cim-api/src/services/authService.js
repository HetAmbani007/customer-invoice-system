import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userRepository from "../repositories/userRepository.js";

class AuthService {
  async register(data) {
    const { firstName, email, phoneNumber, password } = data;
    // check if user exists
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser.length > 0) {
      throw new Error("Email already registered");
    }
    const passwordHash = await bcrypt.hash(password, 10);
    await userRepository.createUser({
      firstName,
      email,
      phoneNumber,
      passwordHash,
    });
  }

  async login({ email, password }) {
    const users = await userRepository.getUserByEmail(email);
    if (users.length === 0) {
      throw new Error("Invalid credentials");
    }
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.passwordhash);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ userId: user.id }, "secretkey", {
      expiresIn: "1h",
    });

    return token;
  }
}

export default new AuthService();
