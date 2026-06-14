import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'br.com.torcidasocial.app',
  appName: 'Torcida Social',
  webDir: 'dist/client',
  server: {
    url: 'https://www.torcidasocial.com.br',
    cleartext: false
  }
};

export default config;
