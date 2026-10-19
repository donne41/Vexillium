Backend setup instructions:
1. npm install
2. Create a .env file with DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, SESSION_SECRET.
   A session secret string cna be created with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
3. Run db/01_schema.sql, then db/02_seed.sql.
5. node app.js