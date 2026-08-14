const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwt');

class AuthService {
  /**
   * Register a new user
   * @param {object} userData - { name, email, password }
   */
  async registerUser({ name, email, password }) {
    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new ApiError(409, 'An account with this email address already exists.');
      }

      const user = await User.create({
        name,
        email,
        password,
      });

      const token = generateToken(user.id);

      return {
        user,
        token,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Error during user registration: ${error.message}`);
    }
  }

  /**
   * Authenticate user with credentials
   * @param {object} credentials - { email, password }
   */
  async loginUser({ email, password }) {
    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

      if (!user) {
        throw new ApiError(401, 'Invalid email or password credentials.');
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid email or password credentials.');
      }

      const token = generateToken(user.id);

      // Return user formatted (without password field)
      const userObj = user.toJSON();

      return {
        user: userObj,
        token,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Error during authentication: ${error.message}`);
    }
  }

  /**
   * Get user profile by ID
   * @param {string} userId 
   */
  async getUserProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, 'User account not found.');
      }
      return user;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, `Error fetching user profile: ${error.message}`);
    }
  }
}

module.exports = new AuthService();
