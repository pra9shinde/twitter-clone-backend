const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');

const { MONGODB } = require('./config');
const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

//
mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected Successfully');
    return server.listen({ port: 3000 });
  })
  .then((res) => {
    console.log(`Server Runnning at ${res.url}`);
  })
  .catch((e) => console.log(e));
