import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'justin.ionic.app',
  appName: 'JustinApp',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '10779002422-vqbkmrec4gcvbkrpggblcgrej4s3l1rk.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
