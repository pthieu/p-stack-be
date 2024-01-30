import 'dotenv/config';
import {
  GetParametersByPathCommand,
  GetParametersByPathCommandInput,
  SSMClient,
} from '@aws-sdk/client-ssm';

export interface Config {
  readonly ENVIRONMENT: string;
  readonly PROJECT_NAME: string;
  readonly PORT: number;
  readonly DATABASE_URL: string;
  readonly AWS_REGION: string;
}

const PROJECT_NAME = 'p-stack-be';
// XXX(Phong): note: a lot of libs use NODE_ENV, so we need to set it
const ENVIRONMENT =
  process.env.ENVIRONMENT || process.env.NODE_ENV || 'development';
const AWS_REGION = process.env.AWS_REGION || 'us-west-2';

// XXX(Phong): Write this to whatever provider you want to use.
// Also, need to create these params in infra, and then fill manually
async function getCloudSecrets() {
  console.log('Retrieving secrets from AWS SSM Parameter Store...');
  const client = new SSMClient({ region: AWS_REGION });
  const input: GetParametersByPathCommandInput = {
    // XXX(Phong): this name needs to be created
    Path: `/${PROJECT_NAME}/env/${ENVIRONMENT}`,
    Recursive: true,
    WithDecryption: true,
  };
  const command = new GetParametersByPathCommand(input);
  const response = await client.send(command);

  const secrets = Object.fromEntries(
    response.Parameters?.map((p) => [p.Name?.split('/').pop(), p?.Value]) || [],
  );

  console.log('Successfully updated process.env with secrets');
  return secrets satisfies Config as Config;
}

// XXX(Phong): must inject  before the config gets frozen or erros will throw
if (process.env.ENVIRONMENT === 'production') {
  const cloudSecrets = await getCloudSecrets();
  Object.entries(cloudSecrets).forEach(([key, value]) => {
    console.log(`Injecting ${key}`);
    process.env[key] = value;
  });
}

const config: Config = Object.freeze({
  ENVIRONMENT,
  PROJECT_NAME,
  PORT: parseInt(getEnvVariable<number>('PORT', 9000) as string, 10),
  DATABASE_URL: getEnvVariable('DATABASE_URL'),
  AWS_REGION,
});

function getEnvVariable<T = string>(
  name: string,
  defaultValue?: T,
): string | T {
  const val = process.env[name];

  if (val) {
    return val;
  }

  if (defaultValue) {
    return defaultValue;
  }

  throw new Error(`Missing environment variable: ${name}`);
}

export default config;
