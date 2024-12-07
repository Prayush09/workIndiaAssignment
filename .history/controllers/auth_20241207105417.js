import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import logger from '../config/logger.js';

export default {
  async register(req, res) {
    try {
      const { name, email, password, adminKey } = req.body;
      
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }

      let role = 'USER';
      if (adminKey) {
        if (adminKey !== process.env.ADMIN_API_KEY) {
          return res.status(403).json({ message: 'Invalid admin key' });
        }
        role = 'ADMIN';
      }

      const user = await User.create({ name, email, password, role });
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ token, user: userWithoutPassword });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({ message: 'Registration failed' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      //TODO: Fix the working of admin api key...
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      const { password: _, ...userWithoutPassword } = user;
      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({ message: 'Login failed' });
    }
  }
};