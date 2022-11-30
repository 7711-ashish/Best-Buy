import React , {useState , useEffect} from 'react'
import LayoutAdmin from '../../components/AdminLayout/LayoutAdmin'
import Message from '../../components/Message'
import { Form , Button } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import web3 from '../../ethereum/web3'
import { Container } from 'semantic-ui-react'
import Encryption from "encrypt-decrypt-library";


export default function newRetailer() {

    const router = useRouter()


    const [validated, setValidated] = useState('Not Set');
    const [Authorized , setAuthorized] = useState(false);

    useEffect(async ()=>{
        if(validated === 'Not Set') 
            getValidation();
    },[]);

    const getValidation = async()=>{
        let accounts = await web3.eth.getAccounts()


        await fetch(`http://localhost:3000/api/properties?metamaskId=${accounts[0]}`)
        .then((response)=>{
                response.json().then((data)=>{
                if(data.length == 0 ){
                    setAuthorized(true);
                }
                setValidated('Set');
            })
        })

        // let superHost = await Admin.methods.superHost().call();
        // console.log(accounts[0] ," ",superHost)
        // if(accounts[0] == superHost)   setAuthorized(true);
        // setValidated('Set');
    }









    

    const [loading, setLoading] = useState(false)
    const [retName, setRetName] = useState('')
    const [retAdd, setRetAdd] = useState('')
    const [retMob, setRetMob] = useState('')
    const [retRazor,setRetRazor] =useState('');


    const handleRetName = (event)=>{
        setRetName(event.target.value)
    }
    const handleRetAdd = (event)=>{
        setRetAdd(event.target.value)
    }
    const handleRetMob = (event)=>{
        setRetMob(event.target.value)
    }
    const handleRetRazor=(event)=>{
        console.log(retMob);
        // const ciphertext = CryptoJS.AES.encrypt(event.target.value, retMob).toString();
        // console.log(ciphertext);
        setRetRazor(event.target.value);
    }



    const onSubmit = async()=>{
        setLoading(true)
        let accounts = await web3.eth.getAccounts();
        const data = await fetch(`http://localhost:3000/api/registerRet?name=${retName}&address=${retAdd}&mobile=${retMob.toString()}&metamaskId=${accounts[0]}&RazorpayId=${retRazor}`)
        console.log(data.json)
        setLoading(false)
        router.replace('/')
    }


    if(!Authorized){
        return (
            <Container className = 'container'><h3 style = {{marginTop:'14px', marginBottom : '0px'}}>You are already a retailer. Click here to go back</h3><br/>
                <Button onClick = {()=>{router.replace('/')}}  primary  size='small'>Click Here!</Button>
            </Container>
        )
    }


    return (
        <LayoutAdmin >
                <div style = {{marginTop : '50px'}}>
                    {/* <Message Mess = {Mess} /> */}
                        <h3>Enter Details to Retailer</h3>
                    <Form onSubmit = {onSubmit}>
                        <Form.Field>
                            <label>Enter Your Name</label>
                            <input value = {retName} onChange = {handleRetName} />
                        </Form.Field>
                        <Form.Field>
                            <label>Enter Your Address</label>
                            <input value = {retAdd} onChange = {handleRetAdd} />
                        </Form.Field>
                        <Form.Field>
                            <label>Enter Your Mobile Number</label>
                            <input value = {retMob} onChange = {handleRetMob} />
                        </Form.Field>
                        <Form.Field>
                            <label>Enter Your Razorpay Key</label>
                            <input type='password' value = {retRazor} onChange = {handleRetRazor} />
                            <a href="https://dashboard.razorpay.com/signup">Create a new account on razorpay</a>
                        </Form.Field>
                        <Button  type='submit' primary loading = {loading}>Sign Up!</Button>
                    </Form>
                </div>
                
            </LayoutAdmin>
    )
}
