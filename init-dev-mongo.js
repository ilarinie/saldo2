db.createUser({
  user: 'saldo-app',
  pwd: 'password123',
  roles: [
    {
      role: 'readWrite',
      db: 'saldo-app',
    },
  ],
});

setVerboseShell(true);
