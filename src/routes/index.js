import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
import restaurantController from '../controller/restaurantController';
import accountController from '../controller/accountController';

let router = express();

//connect to db
initializeDb(db => {
  //internal middleware
  router.use(middleware({ config, db }));

  //api routes v1
  router.use('/restaurant', restaurantController({ config, db }));
  router.use('/account', accountController({ config, db }));
});

export default router;
