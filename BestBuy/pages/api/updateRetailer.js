import { connectToDatabase } from "../../lib/mongodb";


export default async function handler(req,res){
    const { db } = await connectToDatabase()
    const data  = req.query
    console.log(data)

    let metamaskId = data.metamaskId

    const retailer = await db.collection('notes').find({metamaskId : metamaskId}).toArray();

    let update = {
        name : data.name,
        address : data.address,
        mobile : data.mobile,
        metamaskId : data.metamaskId
    }


    const response = await db.collection('notes').update( {metamaskId : metamaskId} , update)

    res.json(response)
}