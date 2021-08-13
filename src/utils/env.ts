if (!process.env.NODE_ENV || process.env.NODE_ENV==='developement') {
   require('dotenv').config();
}

export default {
    ...process.env
}