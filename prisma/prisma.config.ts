import { defineConfig } from '@prisma/client';

export default defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'mysql://tracker_user:sql19980.@localhost:3306/airhelp_tracker',
    },
  },
});
