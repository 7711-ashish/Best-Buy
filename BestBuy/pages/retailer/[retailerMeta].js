import React from 'react'
import web3 from '../../ethereum/web3'
import styles from '../../styles/Home.module.css';
import { useState , useEffect } from 'react'
import { connectToDatabase } from '../../lib/mongodb'
import { useRouter } from 'next/router'
import { Container ,Card, Button,Icon,Grid } from 'semantic-ui-react'
import LayoutRetailer from '../../components/RetailerLayout/LayoutAdmin'


export default  function retailer({curRetailer}) {
    const router = useRouter();

    const [validated, setValidated] = useState('Not Set');
    const [accounts , setAccounts] = useState([]);
    const [items,setItems]=useState([]);

    useEffect(async ()=>{
        if(validated === 'Not Set') 
            getValidation();
         await fetch(`http://localhost:3000/api/ret_Trans_properties?metamaskId=${router.query.retailerMeta}`)
                    .then((response)=>{
                            response.json().then((data)=>{
                            console.log(data[0].product_name);
                             for(let i=0;i<data.length;i++){
                                var obj={
                                    
                                    header : data[i].product_name,
                                    description :   <div>
                                                        <strong>Price : </strong> {data[i].product_price}<br/>
                                                        <strong>Customer MetamaskId : </strong> {data[i].customer_meta}<br/>
                                                        <strong>Manufacturer MetamaskId : </strong> {data[i].manufacturer}<br/>
                                                    </div>,
                                    style : { overflowWrap : 'break-word' }
                                };
                                items.push(obj);
                            }
                            setItems(items => [...items, obj]);
                        })
                    })
    },[]);

    const getValidation = async()=>{
        let accountsList = await web3.eth.getAccounts()
        setAccounts(accountsList)
        setValidated('Set');
        }
   
    if(accounts[0] == router.query.retailerMeta)
    {
        
        return (
            <LayoutRetailer>
            <div class="ui centered card">
            <Card style = {{ "width" : "100%"}} >
                <Card.Content style = {{"wordWrap" : "break-word" }}>
                    <Card.Header>
                      Name : {curRetailer.name}
                    </Card.Header>
                    <Card.Description >
                        <p><Icon name="angle double right"/>id : {curRetailer._id}</p>
                        <p><Icon name="angle double right"/>address : {curRetailer.address} </p>
                        <p><Icon name="angle double right"/>mobile : {curRetailer.mobile}</p>
                        <p><Icon name="angle double right"/>metamaskId : {curRetailer.metamaskId}</p>
                    </Card.Description>
                </Card.Content>
            </Card>
            </div>
            <hr/><br/>
            <div className={styles.title} style={{color:'black',fontSize:'30px'}}>
                        Transaction History
            </div>
            <Grid style = {{marginTop : "50px"}}>
                    <Grid.Row >
                        <Grid.Column width = {13}>
                            <Card.Group items={items} />
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            
            </LayoutRetailer>
        )
    }
    return (
        <Container className = 'container'><h3 style = {{marginTop:'14px', marginBottom : '0px'}}>You are not authorized to access this page. Click here to go back</h3><br/>
            <Button onClick = {()=>{router.replace('/')}}  primary  size='small'>Click Here!</Button>
        </Container>
    )
    
}
export async function getServerSideProps(ctx){
    let accounts = ctx.query.retailerMeta 

    const { db } = await connectToDatabase()
    const data = await db.collection('notes').findOne({metamaskId : accounts});
    
    const curRetailer = JSON.parse(JSON.stringify(data))
   
    return {
        props : {
            curRetailer : curRetailer
        }
    }
}