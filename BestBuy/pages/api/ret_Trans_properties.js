import {connectToDatabase } from '../../lib/mongodb'

export default async function handler(req,res){
    const { db } = await connectToDatabase()
    const element = req.query.metamaskId
    console.log("ele: "+element)
    const data = await db.collection('ret_transactions').find(element).toArray();
    //console.log(data);
    res.json(data)
}