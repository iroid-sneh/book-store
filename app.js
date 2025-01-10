require('dotenv').config();
import express from 'express';
import path from 'path';
import cors from 'cors';
import http from 'http';
import session from 'express-session';
import routes from './routes/index';
import { mongoConnection } from './models/connection';
import errorHandler from './common/error-handler';
import bodyParser from 'body-parser';
import passport from './common/config/facebook';

const port = process.env.PORT || 8002;
const app = express();

mongoConnection();

app.use(
  cors({
    origin: 'http://localhost:8001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(session({
  secret: 'fghdf252',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/', routes);
app.get('/error', (req, res) => {
  res.render('errors/500');
});

app.use(errorHandler);

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Listening on ${process.env.BASE_URL || 'http://localhost'}:${port}`);
});
