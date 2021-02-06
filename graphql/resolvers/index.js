const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentResolvers = require("./comments");

module.exports = {
    Query: {
        ...postsResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentResolvers.Mutation,
    },

    // Like & Comment counts update whenever Post is updated
    Post: {
        //any changes in Post, this will be fired
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length,
    },
};
