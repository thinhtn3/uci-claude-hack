const authService = require('../services/auth.service');

const authController = {
  // POST /api/auth/register
  async register(req, res) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'All fields required' });
      }

      const data = await authService.register(email, password, name);

      res.status(201).json({
        message: 'Registration successful',
        user: data.user,
        session: data.session
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
      }

      const data = await authService.login(email, password);

      res.status(200).json({
        message: 'Login successful',
        user: data.user,
        session: data.session
      });
    } catch (error) {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  },

  // POST /api/auth/logout
  async logout(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }

      await authService.signOut(token);

      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // GET /api/auth/me
  async getCurrentUser(req, res) {
    try {
      // User is already attached by authenticate middleware
      res.status(200).json({ user: req.user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = authController;
