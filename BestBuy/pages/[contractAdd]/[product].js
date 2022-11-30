import React , {useState , useEffect} from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout';
import { Button  ,Icon,Card, Grid, Image , Container} from 'semantic-ui-react';
import Manufacturer from '../../ethereum/manufacturer';
import { route } from 'next/dist/server/router';
import Admin from '../../ethereum/admin'
import web3 from '../../ethereum/web3';
import QRCode from 'qrcode.react';




export default function product({productsList}) {
    
    
    const router = useRouter();
    console.log(productsList);

    const downloadQRCode = (i) => {
        console.log(i);
        const as=document.querySelectorAll("#qrcodeEl")[i];
    const qrCodeURL =as
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    console.log("qrcode=="+qrCodeURL)
    let aEl = document.createElement("a");
    aEl.href = qrCodeURL;
    aEl.download = "QR_Code.png";
    document.body.appendChild(aEl);
    aEl.click();
    document.body.removeChild(aEl);
    }

    let items = [];
    console.log(router.query)

    const handleChangePrice=(e)=>{
    	console.log(router.query.contractAdd);
    	console.log("e== ",e);
        router.replace(`/${router.query.contractAdd}/${router.query.product}/${e}/edit_price`)
    }

    const handleOnChange=(e)=>{
        router.push(`/${router.query.contractAdd}/${router.query.product}/${e}`)
    }

    
    for(let i=0;i<productsList.length;i++){
        let url=`http://localhost:3000/${router.query.contractAdd}/${router.query.product}/${i}`
        console.log(url)

        let features=productsList[i].feature.split(';');
        items.push({
            
            header : features[0],
            meta :<Button icon labelPosition='right' onClick={()=>handleChangePrice(i)}>
                      Price: {productsList[i].price} Rs
                      <Icon name='edit' />
                      
                </Button> ,
            description :   <div>
                                <strong>Retailer : </strong> {productsList[i].retailer}<br/>
                                <strong>Customer : </strong> {productsList[i].customer}<br/>
                                <QRCode
                                    id="qrcodeEl"
                                    size={150}
                                    value={url}
                                  /><br/>
                                  <Button content='Download' onClick={()=>downloadQRCode(i)} primary/>
                        

                                <div style = {{marginTop : '15px'}} >
                                    <Button color={productsList[i].sold ? 'green':'red'}>
                                        {productsList[i].sold ? 'Sold' :  'Not Sold Yet'}
                                    </Button>
                                </div>
                                <Button icon floated='right' onClick={()=>handleOnChange(i)}>
                                    <Icon name='arrow circle right' />
                                </Button>
                            </div>,
            style : { overflowWrap : 'break-word' }
        });
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


    if(Authorized){
        return (
            <Layout>
                <Grid style = {{marginTop : "50px"}}>
                    <Grid.Row >
                        <Grid.Column width = {13}>
                            <Card.Group items = {items} />
                        </Grid.Column>
                        <Grid.Column width = {3}>
                            <Button primary onClick = {()=>{
                                router.push(`/${router.query.contractAdd}/${router.query.product}/addProduct`)
                            }}>Add Products!!</Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
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


product.getInitialProps = async(ctx)=>{
    console.log(ctx.query);
    let curMan = Manufacturer(ctx.query.contractAdd);
    let countProductsAddedInLaunch = await curMan.methods.countProductsAddedInLaunch(ctx.query.product).call();
    console.log(countProductsAddedInLaunch)

    let productsList = await Promise.all(
        Array(parseInt(countProductsAddedInLaunch)).fill().map((element , index)=>{
            return curMan.methods.listingProducts(ctx.query.product,index).call()
        })
    )
    return ({productsList});
}


