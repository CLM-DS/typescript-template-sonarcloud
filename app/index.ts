import dotenv from 'dotenv';
import { loadSecrets } from './config/secretManager';
import { loadConfig } from './config';
import { startServer } from './server';

const run = async () => {
  dotenv.config();
  // set secrets used in app
  const options = {
    env: process.env.APP_ENV || 'qa',
    project: process.env.PROJECT || '',
    version: process.env.VERSION || 'latest',
    keys: [],
  }
  const mode = process.env.MODE || 'offline'
  console.log("mode: " + mode)
  const secrets = await loadSecrets(options, mode);
  const config = loadConfig(secrets);
  
  startServer(config);
};

run();
