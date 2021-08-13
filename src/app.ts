import express, {Express} from 'express';
import morgan from 'morgan';
import { connect } from 'mongoose';
import http from 'http';
import cors from 'cors';
import env from './utils/env';

const router:Express = express();

router.use(morgan('dev'));
router.use(express.urlencoded({extended:false}));
router.use(express.json());
router.use(cors());

/**
 * Mongoose connection
 */
connect(`${env.DB}`, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Database is connected!");
}).catch(err=>{
    console.error(err);
    process.exit(-1)
})

/**
 * Http server
*/

const httpServer = http.createServer(router);
const PORT = env.PORT || 8080;
httpServer.listen(PORT, ()=>console.log(`Listening to port ${PORT}`)
)