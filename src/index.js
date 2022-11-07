const { ApolloServer, gql } = require("apollo-server"); //ApolloServer is a class,gql=pure query language of graphql
const { parseNamedType } = require("graphql/language/parser");
const fetch = require("node-fetch");
const typeDefs = gql`
  type Query {
    getCustomer(id: ID!): customer
    getAllCustomer: [customer]
  }
  type Mutation {
    createCustomer(input: createCustomerInput): customer
  }
  input createCustomerInput {
    name: String
    address: String
    phoneNum: String
  }
  type customer {
    customerId: ID!
    name: String
    address: String
    phoneNum: String
  }
`;

const resolvers = {
  Query: {
    getCustomer: async (_, { id }) => {
      const response = await fetch(`http://localhost:9001/customers/${id}`);
      console.log(response);
      return response.json();
    },
    getAllCustomer: async () => {
      const response = await fetch(
        `http://localhost:9001/customers/customerlist`
      );
      console.log(response);
      return response.json();
    },
  },
  Mutation: {
    createCustomer: async (_, { input: { name, address, phoneNum } }) => {
      const response = await fetch("http://localhost:9001/customers/", {
        method: "POST",
        body: JSON.stringify({ name, address, phoneNum }),
        headers: { "Content-Type": "application/json" },
      });
      console.log(response);
      return response.json();
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers }); // as ApolloServer is a class object must be created with
//the required parameter
server.listen().then(({ url }) => console.log(`server stated at ${url}`));
