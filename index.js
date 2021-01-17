const { ApolloServer, gql } = require('apollo-server');

const typeDef = gql`
    type Query {
        sayHi: String!
    }
`;

const resolvers = {
    Query: {
        sayHi: () => 'Hello World!!!!',
    },
};
