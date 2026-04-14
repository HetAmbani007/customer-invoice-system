import authService from "../services/authService.js";

class AuthController {
  async register(req, res) {
    try {
      await authService.register(req.body);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const token = await authService.login(req.body);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

export default new AuthController();
