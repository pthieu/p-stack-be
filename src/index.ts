import config from './config';
import ApiRouter from '~/api';
import app from '~/app';

const PORT = config.PORT;

export const server = app(ApiRouter);

const _server = server.listen(PORT, () => {
  console.log(`Server listening port ${PORT}`);
});

export default _server;
