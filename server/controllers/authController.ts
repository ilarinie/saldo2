import passport from 'passport';

const foo = (app) => {
  app.get('/api/auth/google', (req, res, next) => {
    console.log('faaa');
    passport.authenticate('google', {
      scope: [
        'https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read',
      ],
    })(req, res, next);
  });
  app.get(
    '/api/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/api/auth/google/failure',
      successRedirect: '/',
    }),
    (req, res) => {
      console.log('fack');
      res.redirect('/');
    }
  );

  app.get('/api/auth/google/failure', (req, res) => {
    console.log('foooo');
    res.send('jee');
  });

  app.get('/api/auth/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });
};

export default foo;
