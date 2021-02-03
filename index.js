const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGODB } = require("./config");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: ({ req }) => ({ req }), //pass request body
});

//
mongoose
    .connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
        console.log("MongoDB Connected Successfully");
        return server.listen({ port: 4000 });
    })
    .then((res) => {
        console.log(`Server Runnning at ${res.url}`);
        global.BASE_URL = res.url;
        global.BASE_DIR = __dirname;
    })
    .catch((e) => console.log(e));
