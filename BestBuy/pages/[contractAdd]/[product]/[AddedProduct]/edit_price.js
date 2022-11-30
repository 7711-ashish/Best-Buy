import React , {useState , useEffect} from 'react'
import { Button, Checkbox, Form , Container } from 'semantic-ui-react'
import Layout from '../../../../components/Layout'
import Manufacturer from '../../../../ethereum/manufacturer'
import web3 from '../../../../ethereum/web3'
import { useRouter } from 'next/router'
import Message from '../../../../components/Message'
import assert from 'assert'
import Admin from '../../../../ethereum/admin'


export default function edit() {
    const router = useRouter()

    const [newPrice, setPrice] = useState('')

    const [loading, setLoading] = useState(false)
    const [Mess, setMess] = useState(null)

    const handleChangePrice = (event)=>{
        event.preventDefault()
        setPrice(event.target.value);
    }
    

    const onSubmit = async()=>{
        console.log("route",router.query)
        let accounts = await web3.eth.getAccounts();

        let getContractId = await Admin.methods.getContractId(accounts[0]).call()
        console.log("get",getContractId)
        console.log("route",router.query)

        if( getContractId == router.query.contractAdd)   setAuthorized(true);
        setValidated('Set');
        let curMan = Manufacturer(router.query.contractAdd);
        
        setLoading(true)

        if(!Authorized){
            setTimeout(() => {
                setMess(null)
            }, 2000);

            setMess({
                type:'failure',
                header : 'Error',
                content : 'You are not a manufacturer'
            })
            setLoading(false);
            return
        }

        
        try {
            assert(newPrice != '')
            await curMan.methods.updateProductPrice(newPrice,router.query.product,router.query.AddedProduct).send({from:accounts[0]});
            setLoading(false)
            router.push(`/${router.query.contractAdd}/${router.query.product}`);
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
        console.log("get",getContractId)
        console.log("route",router.query)

        if( getContractId == router.query.contractAdd)   setAuthorized(true);
        setValidated('Set');
    }


    return (
        <Layout>
            <Message Mess = {Mess} />
            <Form onSubmit = {onSubmit}>
                <Form.Field>
                    <label>Update Price</label>
                    <input value = {newPrice} onChange = {handleChangePrice}/>
                </Form.Field>
                
                <Button loading = {loading} type='submit' primary>Upadte!</Button>
            </Form>
        </Layout>
    )
    
   
}
