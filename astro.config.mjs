// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import 'dotenv/config';

// https://astro.build/config
export default defineConfig({
    integrations: [react()],
});
