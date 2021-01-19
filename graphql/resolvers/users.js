const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userInputError, UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const User = require('../../models/User');

module.exports = {
  Mutation: {
    async register(_, args) {
      // Validate Fields
      const username = args.registerInput.username;
      const email = args.registerInput.email;
      const password = args.registerInput.password;
      const confirmPassword = args.registerInput.confirmPassword;

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

      const token = jwt.sign(
        {
          id: res.id,
          email: res.email,
          username: res.username,
        },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      return {
        ...res._doc,
        id: res._id,
        token: token,
      };
    },
  },
};
