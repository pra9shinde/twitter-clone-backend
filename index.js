const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const { MONGODB } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => ({ req }), //pass request body
});

const app = express();

app.use('/uploads', express.static('uploads')); //Server Static files over Http

server.applyMiddleware({ app });

//
mongoose
    .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB Connected Successfully');
        return app.listen({ port: 4000 });
    })
    .then((res) => {
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
        global.BASE_URL = res.url;
        global.BASE_DIR = __dirname;
    })
    .catch((e) => console.log(e));
