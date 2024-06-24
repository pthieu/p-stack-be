import config from './config';
import ApiRouter from '~/api';
import app from '~/app';

const PORT = config.PORT;

const main = async () => {
  const server = await app(ApiRouter);
  server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  return server;
};

const server = main();
export default server;
