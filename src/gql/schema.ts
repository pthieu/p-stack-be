import { mergeSchemas } from '@graphql-tools/schema';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';

import { entities } from './common';
import { customSchema } from './custom';
import UserSchema from './models/users';

const ModelSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      ...UserSchema.query,
    },
  }),
  // Same rules apply to mutations
  mutation: new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      ...UserSchema.mutation,
    },
  }),
  // In case you need types inside your schema
  types: [...Object.values(entities.types), ...Object.values(entities.inputs)],
});

export const schema = mergeSchemas({
  schemas: [ModelSchema, customSchema],
});
