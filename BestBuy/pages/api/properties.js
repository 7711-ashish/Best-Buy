import {connectToDatabase } from '../../lib/mongodb'

export default async function handler(req,res){
    const { db } = await connectToDatabase()
    const element = req.query
    console.log(element)
    const data = await db.collection('notes').find(element).toArray();
    res.json(data)
}