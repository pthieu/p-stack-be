import { GraphQLNonNull, GraphQLString } from 'graphql';

import { GraphQLMutation, GraphQLQuery, db, entities } from '../common';

const query: GraphQLQuery = {
  users: entities.queries.users,
  findUser: {
    type: new GraphQLNonNull(entities.types.UsersItem),
    args: {
      email: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (_, args) => {
      return db.query.users.findFirst({
        where: (users, { ilike }) => ilike(users.email, `%${args.email}%`),
      });
    },
  },
};

const mutation: GraphQLMutation = {
  updateUsers: entities.mutations.updateUsers,
};

export default { query, mutation };
