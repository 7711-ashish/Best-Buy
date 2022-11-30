import React , {useState , useEffect} from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { route } from 'next/dist/server/router';
import styles from '../../../styles/Home.module.css';
import logo from '../../../public/apple-icon-180x180.png';
import web3 from '../../../ethereum/web3';
import Manufacturer from '../../../ethereum/manufacturer';
import { Button, Card,Segment , List, Container, Icon,Input } from 'semantic-ui-react';
import LayoutAdmin from '../../../components/AdminLayout/LayoutAdmin';
const CryptoJS=require("crypto-js");



export default function AddedProduct({productsList , manInfo}) {

	useEffect (() => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        script.id = 'razorpay-script'
        document.head.appendChild(script)
        return () => {
            const script = document.getElementById('razorpay-script')
            const rContainer = document.querySelector('.razorpay-container')
            console.log('script2', rContainer)
            rContainer && rContainer.remove()
            script && script.remove()
        };
    }, []);
	
	const [loading,setLoading]=useState(false);
	const router = useRouter();
	const [RetMobile,setRetMobile]=useState('');


	const [isSuccess,setSuccess]=useState(false);
	// console.log("router: "+JSON.stringify(router.query))
	console.log(productsList)
	// console.log(manInfo)
	let i=router.query.AddedProduct;
	const features=productsList[i][0].split(';');
	var name=features.shift();
	const amt=productsList[i][1];

 	const confirmPayment= async(val)=>{
 			 let accounts = await web3.eth.getAccounts();
	        let curMan = Manufacturer(router.query.contractAdd);
	        //console.log("customer== "+accounts[0]);
	        setLoading(true);
	        console.log("val"+val)
 			
	        // console.log(router.query.product)
	        // console.log(router.query.AddedProduct)
	        // console.log(Retailer);
	        // console.log(accounts[0].toString());
	        try{
	            await curMan.methods.updateProductSell(router.query.product,router.query.AddedProduct,val,accounts[0]).send({
	            	from:accounts[0]
	            });
	            const data = await fetch(`http://localhost:3000/api/Ret_Trans?metamakId=${val}&customer_meta=${accounts[0]}&product_name=${name}&product_price=${productsList[i][1]}&manufacturer=${manInfo.companyAddress}`)
	            setLoading(false);
	            window.location.href="/";
	            
	        } catch (err) {
		            console.log(err);
		            setLoading(false);
		        }
 	}

 	const ApiForRazorpay =async ()=>{
 		await fetch(`http://localhost:3000/api/properties?mobile=${RetMobile}`)
		        .then((response)=>{
		                response.json().then((data)=>{
		                //console.log("data.add=== "+JSON.stringify(data))
		                // console.log("hret"+RetMobile);
		                // console.log("key== ", CryptoJS.AES.decrypt(data[0].RazorpayId,RetMobile).toString(CryptoJS.enc.Utf8));
		                // //const crypted = CryptoJS.enc.Base64.parse(data[0].RazorpayId);
		                // const cryptkey = CryptoJS.enc.Utf8.parse(RetMobile);
		                // const bytes=CryptoJS.AES.decrypt(data[0].RazorpayId,cryptkey)
				    		displayRazorpay(data[0].metamaskId, data[0].RazorpayId);
		                //console.log("hret"+Retailer);

		            })
		        })
 	}


    const displayRazorpay = async(cust_meta,key) =>{

        
		 console.log(cust_meta);
		 
        console.log("moblie== ",RetMobile);
        console.log("key== ",key);
        const options={
            key:key,
            currency:"INR",
            amount:1*100,
            name:"bestBuy",
            image: "https://live-server-818.wati.io/data/logo/theblingbag.myshopify.com.png?24655",

	        "handler": function(response){
		         alert("pament successfull");
		        confirmPayment(cust_meta);

	        },
	        "prefill":{
	            name:"bestBuy"
	        }
	    };
	    const paymentObject= new window.Razorpay(options)
	    paymentObject.open()
	    paymentObject.on('payment.failed', function (response){
	        alert(response.error.code);
	        alert(response.error.description);
	        alert(response.error.source);
	        alert(response.error.step);
	        alert(response.error.reason);
	        alert(response.error.metadata.order_id);
	        alert(response.error.metadata.payment_id);
		});
	  


	}


	

	let items = []


	for(let i=0;i<features.length-1;i++)
	{
		items.push({
			header : <div> <b><Icon name="angle double right"/>  {features[i]} </b> </div>
		})
	}


	const handleRetMobile=(event)=>{
		setRetMobile(event.target.value);
	}
	const getHome=()=>{
		router.replace(`/`);
	}

    return (


			<Container >
			<Button style = {{ marginTop : '2%'}} onClick={()=>getHome()}  primary floated='right'>Home</Button>
				<main className={styles.main} style = {{ marginLeft : '25%' , marginRight : '25%' ,paddingTop : '0px' }}>

					<img height = '150px' width = '150px' style = {{marginTop : '15px'}} src = {logo.src} />
						<Card style = {{ "width" : "100%"}} >
							<Card.Content style = {{"wordWrap" : "break-word" }}>
								<Card.Header>
									{name}
								</Card.Header>
								<Card.Meta>
									<span >{manInfo.name}</span>
								</Card.Meta>
									<Card.Description >
										<p>
											Manufacturer Address :{ manInfo.companyAddress}
										</p>
										<p>
											<b>Price : {productsList[i][1]} Rs</b>
										</p>

										<List animated verticalAlign='middle' items={items} />
									</Card.Description>
								</Card.Content>
								<p><b>Retailer Mobile Number:</b></p>
							<Input style={{paddingLeft:'4%', paddingRight:'4%'}} value={RetMobile} onChange={handleRetMobile}/><br/>
							<Card.Content extra>
							<a>
							<Button loading = {loading} className={styles.payBtn} disabled={productsList[i][2]} onClick={() =>ApiForRazorpay()} primary>
								Pay
							</Button>
							</a>
							</Card.Content>
						</Card>
				</main>
			</Container>
    )
}

AddedProduct.getInitialProps = async(ctx)=>{
    //console.log(ctx.query);
    let curMan = Manufacturer(ctx.query.contractAdd);
    let countProductsAddedInLaunch = await curMan.methods.countProductsAddedInLaunch(ctx.query.product).call();
    //console.log(countProductsAddedInLaunch)

    let productsList = await Promise.all(
        Array(parseInt(countProductsAddedInLaunch)).fill().map((element , index)=>{
            return curMan.methods.listingProducts(ctx.query.product,index).call()
        })
    )

	let manInfo = await curMan.methods.thisCampany().call();
    return ({productsList , manInfo});

}
