Before starting the multiplayer backend, apply db/07_room_owners.sql once.
Do not rerun it if OwnerUserID already exists.

Quiz rooms are temporary. Starting the backend removes existing rooms
and their participants, including rooms without an owner.
User accounts and saved game results are preserved.

Backend setup instructions:
1. npm install
2. Create a .env file with DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, 
DB_NAME, SESSION_SECRET, NODE_ENV
   Generate SESSION_SECRET with:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

3. Run db/01_schema.sql, then db/02_seed.sql.
4. node app.js
5. Before starting the updated backend, run db/06_user_roles.sql once.
   This adds the role column required by the authorization code.
   For an existing database, apply only the missing migration.
6. Start the backend with node app.js.

### Provision the first administrator

All accounts receive the role `user` by default.
Registration cannot assign the admin role.

Before using the administrator routes:

1. Create the intended administrator account through registration.
2. Open MySQL using an authorized database account.
3. Find and verify the intended account:

   ```sql
   SELECT id, username, email, role
   FROM users
   WHERE username = 'YOUR_ADMIN_USERNAME';
   ```

4. Replace YOUR_ADMIN_ID with the verified numeric ID and run:

   ```sql
   UPDATE users
   SET role = 'admin'
   WHERE id = YOUR_ADMIN_ID;
   ```

5. Verify the role:

   ```sql
   SELECT id, username, role
   FROM users
   WHERE id = YOUR_ADMIN_ID;
   ```

Complete this step when setting up an installation that needs administrator access.
Never automatically promote the first registered user.
