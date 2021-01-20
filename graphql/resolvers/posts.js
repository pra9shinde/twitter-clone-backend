const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');
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
          throw new Error('No post found');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },

  Mutation: {
    // Create Post(Context body is passed in apollo server setup index.js)
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      if (body.trim() === '') {
        throw new Error('Post body is empty');
      }

      const newPost = new Post({
        body,
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
          return 'Post deleted Successfully';
        } else {
          throw new AuthenticationError('This is not your post');
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
        throw new UserInputError('Post not found');
      }
    },
  },
};
