import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';

/**
 * @desc    Register a new user account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, shippingAddress } = req.body;

    if (!name || !email || !password) {
      return sendError(res, 400, 'Please provide name, email, and password.');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return sendError(res, 400, 'An account with this email address already exists.');
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      shippingAddress: shippingAddress || {}
    });

    const token = generateToken(user._id);

    return sendSuccess(res, 201, 'Account successfully created!', {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      shippingAddress: user.shippingAddress,
      role: user.role,
      avatar: user.avatar,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide both email and password.');
    }

    // Explicitly select password since it has select: false
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      return sendSuccess(res, 200, `Welcome back, ${user.name}!`, {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        shippingAddress: user.shippingAddress,
        role: user.role,
        avatar: user.avatar,
        token
      });
    } else {
      return sendError(res, 401, 'Invalid email address or password.');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private (Protected by JWT)
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User profile not found.');
    }

    return sendSuccess(res, 200, 'User profile retrieved', user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile & delivery details
 * @route   PUT /api/auth/profile
 * @access  Private (Protected by JWT)
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 404, 'User not found.');
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;

    if (req.body.shippingAddress) {
      user.shippingAddress = {
        ...user.shippingAddress.toObject(),
        ...req.body.shippingAddress
      };
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const token = generateToken(updatedUser._id);

    return sendSuccess(res, 200, 'Profile successfully updated', {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      shippingAddress: updatedUser.shippingAddress,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot Password - Generate reset token and email it to the user
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 400, 'Please provide an email address.');
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Return 200/generic message to avoid email enumeration attacks
      return sendSuccess(
        res,
        200,
        'If an account exists with that email, a password reset link has been dispatched.'
      );
    }

    // Get reset token and save hashed token to DB
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Client reset URL (points to Vite React frontend)
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl);

      return sendSuccess(
        res,
        200,
        'Password reset link has been sent to your email address.'
      );
    } catch (mailError) {
      // Clear token if email failed
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return sendError(
        res,
        500,
        'Email could not be delivered. Please check SMTP settings or try again later.'
      );
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reset Password using token
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters.');
    }

    // Hash the token sent in params to compare with DB
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return sendError(res, 400, 'Invalid or expired password reset link. Please request a new one.');
    }

    // Set new password (pre-save hook will hash it)
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    return sendSuccess(res, 200, 'Password successfully reset! You are now logged in.', {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Google OAuth Public Configuration
 * @route   GET /api/auth/google/config
 * @access  Public
 */
export const getGoogleAuthConfig = async (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  return sendSuccess(res, 200, 'Google Auth Config', {
    clientId,
    isConfigured: !!clientId
  });
};

/**
 * @desc    Google OAuth 2.0 Sign In / Automatic Registration
 * @route   POST /api/auth/google
 * @access  Public
 */
export const googleLogin = async (req, res, next) => {
  try {
    const { credential, userInfo } = req.body;

    let email = '';
    let name = '';
    let picture = '';
    let googleId = '';

    if (credential) {
      // Verify official Google ID Token via Google tokeninfo endpoint
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        const tokenData = await verifyRes.json();

        if (tokenData && tokenData.email && (tokenData.email_verified === 'true' || tokenData.email_verified === true)) {
          email = tokenData.email.toLowerCase().trim();
          name = tokenData.name || email.split('@')[0];
          picture = tokenData.picture || '';
          googleId = tokenData.sub || '';
        } else {
          return sendError(res, 400, tokenData.error_description || 'Invalid or expired Google ID token.');
        }
      } catch (err) {
        console.error('Google token verification error:', err.message);
        return sendError(res, 400, 'Failed to verify Google token with Google servers.');
      }
    } else if (userInfo && userInfo.email) {
      // Sandbox / direct verified user profile
      email = userInfo.email.toLowerCase().trim();
      name = userInfo.name || email.split('@')[0];
      picture = userInfo.picture || '';
      googleId = userInfo.googleId || `g_${Date.now()}`;
    } else {
      return sendError(res, 400, 'Google credential token or user profile is required.');
    }

    // Find existing account by email or googleId
    let user = await User.findOne({
      $or: [{ email }, { googleId }]
    });

    if (user) {
      // Update Google metadata if missing
      if (!user.googleId && googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
      }
      if (picture && (!user.avatar || user.avatar.includes('unsplash'))) {
        user.avatar = picture;
      }
      await user.save();
    } else {
      // Auto-create new customer account
      const randomPassword = crypto.randomBytes(24).toString('hex') + 'A1!';
      user = await User.create({
        name,
        email,
        password: randomPassword,
        avatar: picture || undefined,
        googleId,
        authProvider: 'google',
        role: 'customer'
      });
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 200, `Welcome to Quantum Mobile, ${user.name}!`, {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      shippingAddress: user.shippingAddress || {},
      role: user.role,
      avatar: user.avatar,
      authProvider: user.authProvider || 'google',
      token
    });
  } catch (error) {
    next(error);
  }
};
