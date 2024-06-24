import { makeExecutableSchema } from '@graphql-tools/schema';
import { GraphQLInputType } from 'graphql';

import { GraphQLRequestContext } from '..';

type Resolvers = {
  Query: Record<
    string,
    (
      source: unknown,
      args: GraphQLInputType,
      context: GraphQLRequestContext,
    ) => unknown
  >;
};

const typeDefs = /* GraphQL */ `
  type Query {
    ping: String
  }

  # type Mutation {
  # }

  schema {
    query: Query
    # mutation: Mutation
  }
`;

const resolvers: Resolvers = {
  Query: {
    ping: (source, args, context) => {
      return context.req.ip;
    },
  },
};

export const customSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
