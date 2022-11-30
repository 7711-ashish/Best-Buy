import React , {useState , useEffect} from 'react'
import { Button, Form , Container } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import Message from '../components/Message'
import web3 from '../ethereum/web3'
import Admin from '../ethereum/admin'
import assert from 'assert'
import Manufacturer from '../ethereum/manufacturer'
import LayoutNew from '../components/LayoutNew'
import LayoutAdmin from '../components/AdminLayout/LayoutAdmin'


export default function New() {
    const router = useRouter()

    const [cname, setCname] = useState('')
    const [ctag, setCtag] = useState('')
    const [cproduct, setCproduct] = useState('')
    const [loading, setLoading] = useState(false)
    const [Mess, setMess] = useState(null)

    const handleChangeName = (event)=>{
        event.preventDefault()
        setCname(event.target.value);
    }
    const handleChangeTag = (event)=>{
        event.preventDefault()
        setCtag(event.target.value);
    }
    const handleChangeProduct = (event)=>{
        event.preventDefault()
        setCproduct(event.target.value);
    }

    const onSubmit = async()=>{
        let accounts = await web3.eth.getAccounts();
        setLoading(true)
        try {
            assert(cname != '' && cproduct != '' && ctag != '')
            await Admin.methods.addManufacturer(cname , cproduct , ctag ).send({from:accounts[0]});
            setLoading(false)

            let contractId = await Admin.methods.getContractId(accounts[0]).call();
            router.replace(`/${contractId}`);
        } catch (error) {
            console.log(error);

            setTimeout(() => {
                setMess(null)
            }, 2000);

            setMess({
                type:'failure',
                header : 'Error',
                content : error.message
            })
            setLoading(false);
        }   
    }



    
    const [validated, setValidated] = useState('Not Set');
    const [Authorized , setAuthorized] = useState(false);

    useEffect(()=>{
        if(validated === 'Not Set') 
            getValidation();
    },[]);

    const getValidation = async()=>{
        let accounts = await web3.eth.getAccounts()

        let getContractId = await Admin.methods.getContractId(accounts[0]).call()

        if( getContractId == '0x0000000000000000000000000000000000000000')   setAuthorized(true);
        setValidated('Set');
    }
    if(Authorized){
        return (
            <LayoutAdmin >
                <div style = {{marginTop : '50px'}}>
                    <Message Mess = {Mess} />
                        <h3>Enter Details to Register</h3>
                    <Form onSubmit = {onSubmit}>
                        <Form.Field>
                            <label>Enter Company Name</label>
                            <input value = {cname} onChange = {handleChangeName}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Enter Tag Line</label>
                            <input value = {ctag} onChange = {handleChangeTag} />
                        </Form.Field>
                        <Form.Field>
                            <label>Enter Product Name</label>
                            <input value = {cproduct} onChange = {handleChangeProduct} />
                        </Form.Field>
                        <Button loading = {loading} type='submit' primary>Sign Up!</Button>
                    </Form>
                </div>
                
            </LayoutAdmin>
        )
    }
    else{
        return (
            <Container className = 'container'><h3 style = {{marginTop:'14px', marginBottom : '0px'}}>Aleady You are a manufacturer. Click here to go back</h3><br/>
                <Button onClick = {()=>{router.replace('/')}}  primary  size='small'>Click Here!</Button>
            </Container>
        )
    }
}
