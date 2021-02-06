const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");

const { UserInputError } = require("apollo-server");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const { validateRegister, validateLogin, validateFile } = require("../../util/validators");

// Create token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            username: user.username,
            name: user.name,
            profilePic: user.profilePic,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
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
            const name = args.registerInput.name;

            const { valid, errors } = validateRegister(username, email, password, confirmPassword, name);

            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            //If username already taken
            const user = await User.findOne({ username: username });

            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "This username is already taken",
                    },
                });
            }

            let profilePic;
            // Fileupload
            if (args.registerInput.image) {
                const file = args.registerInput.image;

                const { valid, errors } = await validateFile(file);
                if (!valid) {
                    throw new UserInputError("Errors", { errors });
                }

                const { createReadStream, filename, mimetype, encoding } = await file;
                // upload file
                const stream = createReadStream();
                const pathName = path.join(BASE_DIR, `/uploads/images/displayPicture/${Date.now() + filename}`);

                await stream.pipe(fs.createWriteStream(pathName));

                profilePic = `uploads/images/displayPicture/${Date.now() + filename}`;
            } else {
                profilePic = `uploads/images/user.png`;
            }

            //   Insert
            const encryPassword = await bcrypt.hash(password, 12);
            const newUser = new User({
                email,
                username,
                name,
                password: encryPassword,
                profilePic: profilePic,
                createdAt: new Date().toISOString(),
            });

            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token: token,
                profilePic: profilePic,
            };
        },

        // Login
        async login(_, { username, password }) {
            const { errors, valid } = validateLogin(username, password);

            if (!valid) {
                throw new UserInputError("Errors", { errors });
            }

            const user = await User.findOne({ username });
            if (!user) {
                errors.general = "User not found";
                throw new UserInputError("User not found, Please register", { errors });
            }

            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = "Wrong credentials";
                throw new UserInputError("Wrong credentials", { errors });
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
