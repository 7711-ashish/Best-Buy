import { connectToDatabase } from "../../lib/mongodb";


export default async function handler(req,res){
    const { db } = await connectToDatabase()
    const data  = req.query
    console.log(data)
    const response = await db.collection('ret_transactions').insertOne(data)

    res.json(response)
}