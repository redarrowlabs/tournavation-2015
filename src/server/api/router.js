import express from 'express';
import * as routes from './routes/index'

var router = express.Router();
for(var route in routes) {
   routes[route](router);
}

export default router;