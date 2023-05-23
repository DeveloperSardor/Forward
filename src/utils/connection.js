import mongoose from 'mongoose';
import config from 'config';
import colors from 'colors'

const connectionString = config.get('connectionDb');



mongoose.connect(connectionString)
  .then(()=>{
    console.log(`Connection MongoDb`.cyan)
  })
  .catch(err=>console.log(err.message))

