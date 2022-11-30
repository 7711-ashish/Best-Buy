import React , {useState , useEffect} from 'react'
import LayoutRetailer from '../../../components/RetailerLayout/LayoutAdmin'
import { Form  ,Button , Container } from 'semantic-ui-react'
import { Message } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import web3 from '../../../ethereum/web3'
import { route } from 'next/dist/server/router'

export default function edit() {
    const router = useRouter()
    
    const [validated, setValidated] = useState('Not Set');
    const [accounts , setAccounts] = useState([]);

    useEffect(()=>{
        if(validated === 'Not Set') 
            getValidation();
    },[]);

    const getValidation = async()=>{
        let accountsList = await web3.eth.getAccounts()
        setAccounts(accountsList)
        setValidated('Set');
    }




    const [name, setName] = useState('')
    const [addrss, setAddrss] = useState('')
    const [mobNo, setMobNo] = useState('')

    const onSubmit = async()=>{


        let accounts = router.query.retailerMeta
        const data = await fetch(`http://localhost:3000/api/updateRetailer?name=${name}&address=${addrss}&mobile=${mobNo.toString()}&metamaskId=${accounts}`)
        console.log(data.json)


        // router.push(`/retailer/${router.query.retailerMeta}`)
    }

    if(accounts[0] == router.query.retailerMeta){
        return (
            <LayoutRetailer>
            {/* <Message Mess = {Mess} /> */}
                <Form onSubmit = {onSubmit}>
                    <Form.Field>
                        <label>Update Name</label>
                        <input value = {name} onChange = {(e)=>{setName(e.target.value)}}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Update Address</label>
                        <input onChange = {(e)=>{setAddrss(e.target.value)}}  />
                    </Form.Field>
                    <Form.Field>
                        <label>Update Mobile No.</label>
                        <input onChange = {(e)=>{setMobNo(e.target.value)}} />
                    </Form.Field>
                    <Button type = "submit" primary>Upadte!</Button>
                </Form>
            </LayoutRetailer>
        )
    }
    return (
        <Container className = 'container'><h3 style = {{marginTop:'14px', marginBottom : '0px'}}>You are not authorized to access this page. Click here to go back</h3><br/>
            <Button onClick = {()=>{router.replace('/')}}  primary  size='small'>Click Here!</Button>
        </Container>
    )
}
