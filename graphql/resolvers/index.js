const postsResolvers = require("./posts");
const usersResolvers = require("./users");

module.exports = {
    Query: {
        ...postsResolvers.Query,
        ...usersResolvers.Query,
    },
    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
    },

    // Like & Comment counts update whenever Post is updated
    Post: {
        //any changes in Post, this will be fired
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.comments.length,
    },
};
