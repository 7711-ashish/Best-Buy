import React , {useState , useEffect} from 'react'
import Layout from '../../../components/Layout'
import { Form , Button , Input , Card , Grid, GridColumn } from 'semantic-ui-react'
import Message from '../../../components/Message'
import web3 from '../../../ethereum/web3'
import Manufacturer from '../../../ethereum/manufacturer'
import { useRouter } from 'next/router'
import assert from 'assert'
import Admin from '../../../ethereum/admin'




export default function AddProduct() {
    const router = useRouter()


    const [loading, setLoading] = useState(false)
    const [proName, setProName] = useState('')
    const [proPrice, setProPrice] = useState('')
    // const [proFeature, setProFeature] = useState('')
    const [Mess, setMess] = useState(null)
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


 


    const [items , setItems] = useState([]);
    const [listKeys , setListKeys] = useState([]);
    const [listValues, setListValues] = useState([])


    const handleChangeInKey = (event)=>{
        let tmpListKeys = listKeys;
        tmpListKeys[event.target.id] = event.target.value
        setListKeys(tmpListKeys)
        // console.log(listKeys)
        // console.log(event.target.id)
    }

    const handleChangeInValue = (event)=>{
        let tmpListValues = listValues
        tmpListValues[event.target.id] = event.target.value
        setListValues(tmpListValues)
        // console.log(listValues)
    }

    const handleClickAdd = ()=>{
        let tmp = items
        let len = items.length
        
        let tmpListKeys = listKeys;
        tmpListKeys.push('')
        setListKeys(tmpListKeys)

        let tmpListValues = listValues
        tmpListValues.push('')
        setListValues(tmpListValues)

        tmp.push(
        {
            key : len,
            header : <Form>
                        <Form.Group widths='equal'>
                            <Form.Input 
                                key = {len} 
                                id = {len}
                                fluid label='Key' 
                                placeholder='Enter Key' 
                                onChange = {handleChangeInKey}
                            />
                            <Form.Input 
                                key = {len} 
                                id = {len}
                                fluid label='Value' 
                                placeholder='Enter Value' 
                                onChange = {handleChangeInValue}
                            />
                        </Form.Group>
                    </Form>,
            color : 'red',
            fluid : true,
            key : tmp.length
        })
        setItems(tmp)
        router.replace(`/${router.query.contractAdd}/${router.query.product}/addProduct`)
    }

    const handleClickRem = ()=>{
        let tmp = items

        let tmpListKeys = listKeys;
        tmpListKeys.pop()
        setListKeys(tmpListKeys)

        let tmpListValues = listValues
        tmpListValues.pop()
        setListValues(tmpListValues)
        
        tmp.pop()
        setItems(tmp)
        router.replace(`/${router.query.contractAdd}/${router.query.product}/addProduct`)
    }



    const onSubmit = async()=>{
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
            assert(proName != '' && proPrice != '')
            let accounts = await web3.eth.getAccounts()
            let curMan = Manufacturer(router.query.contractAdd);

            let productFeatures = proName + ';';

            for(let i=0;i<items.length;i++){
                productFeatures = productFeatures + listKeys[i] + ':' + listValues[i] + ';'
            }

            console.log(productFeatures)

            await curMan.methods.addProduct(router.query.product , proPrice , productFeatures)
                .send({from : accounts[0]});

            setLoading(false)
            
            router.replace(`/${router.query.contractAdd}/${router.query.product}`)
        } catch (error) {

            setTimeout(() => {
                setMess(null)
            }, 2000);

            setMess({
                type : 'failure',
                header : 'Error',
                content : error.message
            })
            setLoading(false)
        }
    }

 
    return (
        <Layout>
            <Message Mess = {Mess} />
            <Form >
                <Form.Field>
                    <label>Enter Product Name</label>
                    <Input onChange = {(event)=>{setProName(event.target.value)}}/>
                </Form.Field>
                <Form.Field>
                  <label>Enter Product Features</label>
                     <Card.Group items = {items} />
                        <Button style = {{marginTop : '40px'  ,marginRight : '5px'}} onClick = {handleClickAdd}>Add Feature</Button>
                        <Button style = {{marginTop : '40px' , marginLeft : '5px'}} onClick = {handleClickRem}>Remove Feature</Button>
                </Form.Field>
                <Form.Field>
                    <label>Enter Price</label>
                    <Input
                        label={{ basic: true, content: 'Rs' }}
                        labelPosition='right'
                        placeholder='Enter Price...'
                        onChange = {(event)=>{setProPrice(event.target.value)}}
                    />
                </Form.Field>
                <Button onClick = {onSubmit} loading = {loading} type='submit' primary  style = {{marginTop : '30px'}}>Add Product!</Button><br/>
            </Form> 
            
           
        </Layout>
    )
}
