import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { Request, Response } from 'express';

import { schema } from './schema';

export type GraphQLRequestContext = {
  req: Request;
  res: Response;
};

export const useApollo = async () => {
  const server = new ApolloServer<GraphQLRequestContext>({ schema });
  await server.start();
  return expressMiddleware<GraphQLRequestContext>(server, {
    context: async ({ req, res }) => {
      // You can implement authentication here
      if (req.headers.authorization !== 'bearer token') {
        console.log('Unauthorized');
      }
      return {
        req,
        res,
      };
    },
  });
};
