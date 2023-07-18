import { defineConfig } from 'astro/config';

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    server: {
        fs: {
           // if you use this with --host anyone on the network can view
           // the contents of your yarn cache (including private packages)
            strict: false 
        }
    }
}
});