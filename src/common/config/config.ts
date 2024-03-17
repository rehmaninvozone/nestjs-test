import type { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  security: {
    expiresIn: '15d',
    refreshIn: '30d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
