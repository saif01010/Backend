import mongoos from 'mongoose';
import { DB_Name } from '../constants.js';

const connection = async () => {
    try{
        const connectionInfo = await mongoos.connect(`${process.env.DB_URL}/${DB_Name}`);
        console.log("Connected to Database",connectionInfo.connection.host)
    }
    catch(error){
        console.log("Failed to Connect",error)
        process.exit(1)
    }
}

export default connection;