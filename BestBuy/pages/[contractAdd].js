import { useRouter } from 'next/router';
import React , {useState , useEffect} from 'react'
import { Card , Icon ,Grid , Image  ,Button , Container} from 'semantic-ui-react';
import Layout from '../components/Layout'
import Manufacturer from '../ethereum/manufacturer'
import web3 from '../ethereum/web3'
import Admin from '../ethereum/admin'

let manufacturer;

export default function ContractAdd({productNames , manInfo}) {
    const router = useRouter();
    manufacturer = Manufacturer(router.query.contractAdd);


    let items = []
    for(let i = 0; i < productNames.length ; i++){
        items.push({
            header:`${productNames[i].name}`,
            // href :`/${router.query.contractAdd}/${productNames[i].index}` ,
            onClick : ()=>{
                router.push(`/${router.query.contractAdd}/${productNames[i].index}`)
            },
            fluid : true
        })
    }


    const [validated, setValidated] = useState('Not Set');
    const [Authorized , setAuthorized] = useState(false);

    useEffect(()=>{
        if(validated === 'Not Set') 
            getValidation();
    },[]);

    const getValidation = async()=>{
        let accounts = await web3.eth.getAccounts()
        let superHost = await Admin.methods.superHost().call();

        let getContractId = await Admin.methods.getContractId(accounts[0]).call()

        if(accounts[0] == superHost || getContractId == router.query.contractAdd)   setAuthorized(true);
        setValidated('Set');
    }

    if(Authorized)
    {
        return (
            <Layout >
                <Grid >
                    <Grid.Row>
                    <Grid.Column width={10}>
                        <Card style = {{ "width" : "100%"}} >
                            <Card.Content style = {{"wordWrap" : "break-word" }}>
                                <Card.Header>
                                    {manInfo.name}
                                </Card.Header>
                                <Card.Meta>
                                    <span >{manInfo.tag}</span>
                                </Card.Meta>
                                    <Card.Description >
                                        <p>
                                            <b>Product Name : {manInfo.product}</b><br/>
                                            Manufacturer Address : {manInfo.companyAddress}
                                        </p>
                                    </Card.Description>
                                </Card.Content>
                            <Card.Content extra>
                            <a>
                                <Icon name='product hunt' />
                                Products Launched {manInfo.productCount}
                            </a>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <Button style = {{marginTop : "45px"}} floated = "right" size='big' primary onClick = {
                            ()=>{
                                router.push(`/${router.query. contractAdd}/launch`)
                            }
                        }
                            >Launch New Product!!</Button>
                    </Grid.Column>
                    </Grid.Row>
                </Grid>

            <Card.Group items={items} />
            </Layout>
        )
    }
    else{
        return (
            <Container className = 'container'><h3 style = {{marginTop:'14px', marginBottom : '0px'}}>You are not authorized to access this page. Click here to go back</h3><br/>
                <Button onClick = {()=>{router.replace('/')}}  primary  size='small'>Click Here!</Button>
            </Container>
        )
    }

}


ContractAdd.getInitialProps = async(ctx)=>{
    manufacturer = Manufacturer(ctx.query.contractAdd);
    let countLaunchedProducts = await manufacturer.methods.countLaunchedProducts().call();

    let productNames = [];

    for(let i = 0;i<countLaunchedProducts;i++)
    {
        let newProduct = await manufacturer.methods.productNames(i).call();
        productNames.push({
            index : i,
            name : newProduct
        })
    }
    let manInfo = await manufacturer.methods.thisCampany().call();
    return { productNames , manInfo }
}


