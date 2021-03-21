const { gql } = require('apollo-server-express');

const typeDef = gql`
    type Post {
        id: ID!
        body: String!
        createdAt: String!
        username: String!
        comments: [Comment]!
        likes: [Like]!
        likeCount: Int!
        commentCount: Int!
        imageURL: String
        user: User!
    }

    type Query {
        getPosts: [Post]
        getPost(postId: ID!): Post
        getUser(userId: ID!): User
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
        login(username: String!, password: String!): User!
        createPost(body: String!, image: Upload): Post!
        deletePost(postId: ID!): String!
        createComment(postId: String!, body: String!): Post!
        deleteComment(postId: ID!, commentId: ID!): Post!
        likePost(postId: ID!): Post!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
        name: String!
        image: Upload
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
        name: String!
        profilePic: String!
    }

    type Comment {
        id: ID!
        createdAt: String!
        username: String!
        body: String!
    }

    type Like {
        id: ID!
        createdAt: String!
        username: String!
    }
`;

module.exports = typeDef;
