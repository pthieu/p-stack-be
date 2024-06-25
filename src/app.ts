import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Router } from 'express';
import path from 'path';

import { useApollo } from './gql';

// import winston from './lib/logger';

export default async function app(routes: Router) {
  const app = express();

  app.use(cors());
  app.use(compression());
  // app.use(morgan('combined', { stream: winston.stream }));
  app.use(express.static(path.join(__dirname, 'public')));

  // XXX(Phong): if you're doing any type of proxying or routing, you should
  // comment this out because it will destroy the buffer stream for the body
  // so the target you're forwarding to will not get a proper payload
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get('/favicon.ico', (_, res) => res.sendStatus(204));

  app.use('/', routes);
  app.use('/graphql', await useApollo());

  return app;
}
