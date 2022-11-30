import React , {useState , useEffect} from 'react'
import { Button, Checkbox, Form , Container } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import Manufacturer from '../../ethereum/manufacturer'
import web3 from '../../ethereum/web3'
import { useRouter } from 'next/router'
import Message from '../../components/Message'
import assert from 'assert'
import Admin from '../../ethereum/admin'


export default function edit() {
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
            assert(cname != '' && cproduct != '' && ctag != '')
            await curMan.methods.updateCompany(cname,cproduct,ctag).send({from:accounts[0]});
            setLoading(false)
            router.push(`/${router.query.contractAdd}`);
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

        if( getContractId == router.query.contractAdd)   setAuthorized(true);
        setValidated('Set');
    }


    return (
        <Layout>
            <Message Mess = {Mess} />
            <Form onSubmit = {onSubmit}>
                <Form.Field>
                    <label>Update Company Name</label>
                    <input value = {cname} onChange = {handleChangeName}/>
                </Form.Field>
                <Form.Field>
                    <label>Update Tag Line</label>
                    <input value = {ctag} onChange = {handleChangeTag} />
                </Form.Field>
                <Form.Field>
                    <label>Update Product Name</label>
                    <input value = {cproduct} onChange = {handleChangeProduct} />
                </Form.Field>
                <Button loading = {loading} type='submit' primary>Upadte!</Button>
            </Form>
        </Layout>
    )
    
   
}
