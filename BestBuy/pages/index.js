// export default function index({manufacturers}) {

//     const router = useRouter();
//     let items = [];
//     const [selected, setSelected] = useState('');
//     const [Mess, setMess] = useState(null);

//     const handleAdminClick = async()=>{
//         let accounts = await web3.eth.getAccounts();
//         let superHost = await Admin.methods.superHost().call();
//         if(accounts[0] === superHost){

            
            
//             setSelected('admin');
//             router.push('/admin');
            
//             console.log(items);
//         }
//         else{
//             setTimeout(() => {
//                 setMess(null)
//             }, 2000);
//             setMess({
//                 type : 'negative',
//                 header : 'Error',
//                 content : "You are not admin"
//             })
//         }
//     }
//     const handleManClick = async()=>{
//         let accounts = await web3.eth.getAccounts();
//         let isManufacturer = await Admin.methods.isManufacturer(accounts[0]).call();

//         if(isManufacturer){
//             let getContractId = await Admin.methods.getContractId(accounts[0]).call();
//             setSelected('manufacturer');
//             router.replace(`/${getContractId}`)
//         }
//         else{
//             router.replace('/new');
//         }
//     }


   
//     if(selected === 'admin'){
//         return (
//             <Layout>
//                 <Card.Group items={items} />
//             </Layout>
//         )
//     }
//     else if(selected === 'manufacturer'){
//         return(
//             <Layout>
                
//             </Layout>
//         )
//     }
//     else{
//         return(
//             <Layout>
//                 <Message Mess = {Mess}/>
//                 <h3>Sign in as</h3>
//                 <Button onClick = {handleAdminClick}>Admin</Button>
//                 <Button onClick = {handleManClick}>Manufacturer</Button>
//             </Layout>
//         )
//     }
    
// }

import { useRouter } from 'next/router';
import React , { useState,useEffect }from 'react'
import { Button, Card,Segment } from 'semantic-ui-react';
import Layout from '../components/Layout';
import Admin from '../ethereum/admin'
import Manufacturer from '../ethereum/manufacturer';
import web3 from '../ethereum/web3';
import Message from '../components/Message';
import { route } from 'next/dist/server/router';
import Image from 'next/image';
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { connectToDatabase } from '../lib/mongodb';


import logo from '../public/apple-icon-180x180.png'


function HeadTag()
{
    return(
        <Head>
            <title>BestBuy</title>
            <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png"/>
            <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png"/>
            <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png"/>
            <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png"/>
            <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png"/>
            <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png"/>
            <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png"/>
            <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png"/>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"/>
            <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
            <link rel="manifest" href="/manifest.json"/>
            <meta name="msapplication-TileColor" content="#ffffff"/>
            <meta name="msapplication-TileImage" content="/ms-icon-144x144.png"/>
            <meta name="theme-color" content="#ffffff"/>
        </Head>
    )
}


export default function index({manufacturers , retailersList}) {
    const router = useRouter();
    let items = [];
    const [selected, setSelected] = useState('');
    const [Mess, setMess] = useState(null);
     useEffect( ()=>{
        window.addEventListener('load', function () {
          if (typeof web3 !== 'undefined') {
            console.log('web3 is enabled')
            if (web3.currentProvider.isMetaMask === true) {
              console.log('MetaMask is active')
            } else {
              alert("MetaMask is not available");
            }
          } else {
            alert("MetaMask is not Found Please Install");
          }
        });
    },[]);


    const handleAdminClick = async()=>{




        let accounts = await web3.eth.getAccounts();
        let superHost = await Admin.methods.superHost().call();
        if(accounts[0] === superHost){

            
            
            setSelected('admin');
            router.push('/admin');
            
        }
        else{
            setTimeout(() => {
                setMess(null)
            }, 2000);


            setMess({
                type : 'negative',
                header : 'Error',
                content : "You are not admin"
            })
        }
    }
    const handleManClick = async()=>{
        let accounts = await web3.eth.getAccounts();
        let isManufacturer = await Admin.methods.isManufacturer(accounts[0]).call();

        if(isManufacturer){
            let getContractId = await Admin.methods.getContractId(accounts[0]).call();
            setSelected('manufacturer');
            router.replace(`/${getContractId}`)
        }
        else{
            router.push('/new');
        }
    }

    const handleCustClick=()=>{
        router.push('/customer');
    }

    const handleRetClick = async()=>{
         let accounts  = []
        accounts = await web3.eth.getAccounts()

        await fetch(`http://localhost:3000/api/properties?metamaskId=${accounts[0]}`)
        .then((response)=>{
                response.json().then((data)=>{
                // console.log(data)

                if(data.length >= 1 )
                    router.push(`/retailer/${accounts[0]}`)
                else
                    router.push(`/retailer/newRetailer`)
            })
        })
    }


  return (
    <div className={styles.container}>
        <HeadTag/>
        <Message Mess = {Mess}/>
        <main className={styles.main}>
            <img height = '150px' width = '150px' style = {{marginBottom : '15px'}} src = {logo.src} />
            <h1 className={styles.title}>
                Welcome to BestBuy
            </h1>
            <p className={styles.description}>
                Please SignIn/SignUp as
            </p>

            
            <Segment className={styles.grid} style = {{background : 'black'}}>
                <Button style = {{margin : '5px'}} content="Admin" onClick = {handleAdminClick} primary  className={styles.card}/>
                <Button style = {{margin : '5px'}} content="Manufacturer" onClick = {handleManClick} primary  className={styles.card} />
                <Button style = {{margin : '5px'}} content="Retailer" onClick = {handleRetClick}  primary className={styles.card}/>
                <Button style = {{margin : '5px'}} content="Customer" onClick = {handleCustClick} primary className={styles.card}/>
            </Segment>
        </main>
    </div>
  )
}





export async function getServerSideProps(ctx){
  
    let listOfManufacturers = await Admin.methods.getListOfManufacturers().call();
    let manufacturers = [];
    for(let i=0 ; i < listOfManufacturers.length ; i++)
    {
        let curMan = Manufacturer(listOfManufacturers[i]) ;
        let curManInfo = await curMan.methods.thisCampany().call();
        manufacturers.push({
            contractAdd : listOfManufacturers[i],
            manAddress : curManInfo.companyAddress,
            name : curManInfo.name,
            product : curManInfo.product,
            productCount : curManInfo.productCount,
            tag : curManInfo.tag,

        });
    }


    // db connectivity

    let accounts  = []
    accounts = await web3.eth.getAccounts()
        
    setTimeout(() => {
        console.log(accounts[0])
    }, 2000);

    const { db } = await connectToDatabase()
    const data = await db.collection('notes').find({title : 'This is tile'}).toArray();
    const retailersList = JSON.parse(JSON.stringify(data))

    return {
        props : {
            retailersList : retailersList,
            manufacturers : manufacturers
        }
      }
}