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
    cors: {
        origin: 'https://shindetter.netlify.app',
        credentials: true,
    },
});

const app = express();

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://shindetter.netlify.app'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use('/uploads', express.static('uploads')); //Server Static files over Http

server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;

//
mongoose
    .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true, poolSize: 100 })
    .then(() => {
        console.log('MongoDB Connected Successfully');
        return app.listen({ port: PORT });
    })
    .then((res) => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        global.BASE_URL = res.url;
        global.BASE_DIR = __dirname;
    })
    .catch((e) => console.log(e));
