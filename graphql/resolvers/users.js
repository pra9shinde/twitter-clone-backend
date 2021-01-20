const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { userInputError, UserInputError } = require('apollo-server');
const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');
const { validateRegister, validateLogin } = require('../../util/validators');

// Create token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  );
};

module.exports = {
  Mutation: {
    // Register Mutation
    async register(_, args) {
      // Validate Fields
      const username = args.registerInput.username;
      const email = args.registerInput.email;
      const password = args.registerInput.password;
      const confirmPassword = args.registerInput.confirmPassword;

      const { valid, errors } = validateRegister(username, email, password, confirmPassword);

      if (!valid) {
        throw new UserInputError('Errors', errors);
      }

      //If username already taken
      const user = await User.findOne({ username: username });

      if (user) {
        throw new UserInputError('Username is taken', {
          errors: {
            username: 'This username is already taken',
          },
        });
      }

      //   Insert
      const encryPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        username,
        password: encryPassword,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token: token,
      };
    },

    // Login
    async login(_, { username, password }) {
      const { errors, valid } = validateLogin(username, password);

      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token: token,
      };
    },
  },
};
