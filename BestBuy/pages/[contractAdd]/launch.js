import { useRouter } from 'next/router'
import React, { useState , useEffect } from 'react'
import { Button, Checkbox, Form } from 'semantic-ui-react'
import Layout from '../../components/Layout'
import Message from '../../components/Message'
import Manufacturer from '../../ethereum/manufacturer'
import assert from 'assert'
import web3 from '../../ethereum/web3'
import Admin from '../../ethereum/admin'


let manufacturer;



export default function launch() {
    const router = useRouter();


    manufacturer = Manufacturer(router.query.contractAdd);

    const [product, setProduct] = useState('');
    const [loading, setLoading] = useState(false);
    const [Mess, setMess] = useState(null)

    const handleSubmit = async(event)=>{
        event.preventDefault();
        setLoading(true);

        
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
            assert(product != '')
            let accounts = await web3.eth.getAccounts();

            let contractId = await Admin.methods.getContractId(accounts[0]).call()
            assert(router.query.contractAdd == contractId);

            await manufacturer.methods.launchProduct(product).send({
                from : accounts[0]
            });
            console.log(product)
            setLoading(false);
            
            router.replace(`/${router.query. contractAdd}`)

        } catch (error) {
            setLoading(false);

            setTimeout(() => {
                setMess(null);
            }, 2000);

            setMess({
                type : 'negative',
                header : 'Error',
                content : error.message
            })
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
            <Message Mess = {Mess}/>
            <Form onSubmit = {handleSubmit}>
                <Form.Field>
                    <label>Enter Product Name</label>
                    <input value = {product} onChange = {(event)=>{setProduct(event.target.value)}}  />
                </Form.Field>
                <Button loading = {loading} type='submit' primary>Launch!</Button>
            </Form>
        </Layout>
    )
}

