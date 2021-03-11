import express from 'express';
import cors from 'cors';
import session from 'express-session';
import bodyParser from 'body-parser';
import next from 'next';
import { Sequelize } from 'sequelize-typescript';
import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as twitchStrategy } from 'passport-twitch-new';
import connectSessionSequelize from 'connect-session-sequelize';
import { apiRouter } from './api/routes';
import { User } from './models/user';

dotenv.config();

const port = parseInt(process.env.PORT ?? '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const SequelizeStore = connectSessionSequelize(session.Store);

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.PG_HOST ?? 'localhost',
  database: process.env.PG_DATABASE ?? 'pokemon-manager-3',
  username: process.env.PG_USERNAME ?? 'may',
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT, 10) ?? 5432,
  dialectOptions: dev ? undefined : {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  models: [`${__dirname}/models`],
  modelMatch: (filename, member) => {
    return filename[0].toUpperCase() + filename.substring(1) === member;
  },
});

passport.use(
  new twitchStrategy({
    clientID: process.env.TWITCH_CLIENT_ID,
    clientSecret: process.env.TWITCH_CLIENT_SECRET,
    callbackURL: `${process.env.HOSTNAME}/auth/callback`,
    scope: 'user_read',
  }, async (_accessToken, _refreshToken, profile, done) => {
    try {
      const [user] = await User.findOrCreate({
        where: { profileId: profile.id },
        defaults: {
          displayName: profile.display_name,
          email: profile.email,
        }
      });

      done(null, {
        ...(user.get({ plain: true })),
        isAuthorized: await user.isAuthorized(),
      });
    } catch (e) {
      done(e);
    }
  }
));

sequelize.sync({ alter: true });

app.prepare().then(async () => {
  try {
    await sequelize.authenticate();

    const server = express();
    
    server.use(cors());
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));

    const sequelizeStore = new SequelizeStore({
      db: sequelize,
    });

    const sessionConfig = {
      secret: process.env.SESSION_SECRET,
      store: sequelizeStore,
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: false,
      },
    };

    if (server.get('env') === 'production') {
      server.set('trust proxy', 1) 
      sessionConfig.cookie.secure = true;
    }

    server.use(session(sessionConfig));
    server.use(passport.initialize());
    server.use(passport.session());

    sequelizeStore.sync();

    passport.serializeUser((user, done) => {
      done(null, user);
    });
    
    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    server.get('/auth', passport.authenticate('twitch'));
    server.get('/auth/callback', passport.authenticate('twitch', { failureRedirect: '/' }), function(_req, res) {
      res.redirect("/");
    });

    server.get('/login', (req, res) => handle(req, res));
    server.get('/unauthorized', (req, res) => handle(req, res));

    server.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/login');
    });

    
    server.use('/api/v1', apiRouter);

    server.get('*', (req, res) => handle(req, res));

    server.use(function (err, req, res, next) {
      console.error(err);
      
      res.status(500);
      res.send("Oops, something went wrong.")
    });

    server.listen(3000, (err: Error): void => {
      if (err) throw err;

      console.log(`> Server listening on port ${port} (dev: ${dev})`); 
    });
  } catch(e) {
    console.error('Unable to start server, exiting...');
    console.error(e);
    process.exit();
  }
});