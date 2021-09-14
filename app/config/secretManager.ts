import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { OptionInterface, SecretInterface } from '../interfaces';

/**
 * Load Secret and return object to values access
 * @param {OptionInterface} options parameters to search data in GCP
 * @param {'online'|'offline'} mode online: used secret manager GCP, offline: enviroment vaiables
 * @returns {SecretInterface}
 */
const loadSecrets = async (options: OptionInterface, mode: string): Promise<SecretInterface> => {
  let secrets: { [key: string]: string } | NodeJS.ProcessEnv = {};

  if (mode === 'online') {
    const client = new SecretManagerServiceClient();
    const [listSecrets] = await client.listSecrets({
      parent: `projects/${options.project}`,
    });

    for (let index = 0; index < listSecrets.length; index++) {
      const secret = listSecrets[index];
      const name = secret.name?.toString();
      let env = options.env.toUpperCase();

      if (!env.startsWith('_')) {
        env = `_${env}`;
      }

      if (name && name.endsWith(env)) {
        const key = name.substring(0, name.length - env.length).toUpperCase();
        const keyParts = key.split('/');
        const keyName = keyParts[keyParts.length - 1];

        if (options.keys.length > 0 && options.keys.indexOf(keyName) < 0) {
          continue;
        }

        // eslint-disable-next-line no-await-in-loop
        const [version] = await client.accessSecretVersion({
          name: `${name}/versions/${options.version}`,
        });
        secrets[keyName] = version.payload?.data?.toString();
      }
    }
  } else {
    secrets = process.env;
  }

  return {
    get: (name: string) => {
      const secret = secrets[name.toUpperCase()];

      if (!secret) {
        throw new Error(`${name} in secret variables not found`);
      }

      return secret;
    },
  };
};

export { loadSecrets };
