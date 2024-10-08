1. ".env"-Datei erzuegen mit der Syntax:
SUPABASE_URL=https://zjnvamrbn
SUPABASE_KEY=eyJhbGciOi

2. "babel.config.js" Datei erzeugen mit dem Inhalt
module.exports = function (api) {
  api.cache(true);
  return {
  presets: ["babel-preset-expo"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
      },
    ],
  ],
  };
  };

3. Den Command "npm install react-native-dotenv" ausführen

4. In der Datei wo man es braucht so importieren:
import { SUPABASE_URL, SUPABASE_KEY } from '@env';

const supabaseUrl = SUPABASE_URL;
const supabaseKey = SUPABASE_KEY;