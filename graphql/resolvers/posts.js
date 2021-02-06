const { AuthenticationError, UserInputError } = require("apollo-server");
const path = require("path");
const fs = require("fs");

const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");
const { validateFile } = require("../../util/validators");

module.exports = {
    Query: {
        async getPosts() {
            try {
                const posts = await Post.find().sort({ createdAt: -1 });
                return posts;
            } catch (err) {
                throw new Error(err);
            }
        },

        async getPost(_, { postId }) {
            try {
                const post = await Post.findById(postId);
                if (post) {
                    return post;
                } else {
                    throw new Error("No post found");
                }
            } catch (error) {
                throw new Error(error);
            }
        },
    },

    Mutation: {
        // Create Post(Context body is passed in apollo server setup index.js)
        async createPost(_, { body, image }, context) {
            const user = checkAuth(context);

            if (body.trim() === "") {
                throw new Error("*Tweet should'nt be empty...");
            }

            let imageURL = "";
            // Fileupload
            if (image) {
                const { valid } = await validateFile(image);
                if (!valid) {
                    throw new Error("*Only jpg/png/jpeg images are allowed");
                }

                const { createReadStream, filename, mimetype, encoding } = await image;
                // upload file
                const stream = createReadStream();
                const pathName = path.join(BASE_DIR, `/uploads/images/post/${Date.now() + filename}`);
                await stream.pipe(fs.createWriteStream(pathName));

                imageURL = `uploads/images/post/${Date.now() + filename}`;
            }

            const newPost = new Post({
                body,
                imageURL,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString(),
            });
            const post = await newPost.save();
            return post;
        },

        // Delete Post
        async deletePost(_, { postId }, context) {
            const user = checkAuth(context);
            try {
                const post = await Post.findById(postId);
                if (user.username === post.username) {
                    await post.delete();
                    return "Post deleted Successfully";
                } else {
                    throw new AuthenticationError("This is not your post");
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        // Like-Unlike Post
        async likePost(_, { postId }, context) {
            const { username } = checkAuth(context);

            const post = await Post.findById(postId);
            if (post) {
                // If user already like the post
                if (post.likes.find((like) => like.username === username)) {
                    // Unlike it
                    post.likes = post.likes.filter((like) => like.username !== username);
                } else {
                    // Like the post
                    post.likes.push({
                        username,
                        createdAt: new Date().toISOString(),
                    });
                }

                await post.save();
                return post;
            } else {
                throw new UserInputError("Post not found");
            }
        },
    },
};
