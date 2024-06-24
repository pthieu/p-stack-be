import { buildSchema } from 'drizzle-graphql';
import { GraphQLFieldConfig } from 'graphql';

import { GraphQLRequestContext } from '.';
import { createOrGetDb } from '../db';

const db = createOrGetDb();

const { entities } = buildSchema(db);

export type GraphQLQuery = Record<
  string,
  GraphQLFieldConfig<unknown, GraphQLRequestContext>
>;
export type GraphQLMutation = Record<
  string,
  GraphQLFieldConfig<unknown, GraphQLRequestContext>
>;

export { db, entities };
