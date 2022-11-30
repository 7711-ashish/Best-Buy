import { useRouter } from 'next/router';
import React, { Component , useState} from 'react'
import { Input, Menu } from 'semantic-ui-react'
import logo from '../../public/android-icon-192x192.png'


export default function HeaderAdmin() {
    const router = useRouter();

    let curUrl = router.route;

    let initialState = '';

    console.log(curUrl);
    if(curUrl.slice(curUrl.length - 6 , curUrl.length) === 'launch'){
        initialState = 'Launch New Product';
    }
    else if(curUrl.slice(curUrl.length - 4 , curUrl.length) === 'edit'){
        initialState = 'Edit Profile';
    }
    else{
        initialState = 'Launched Products';
    }


    const [activeItem, setActiveItem] = useState(initialState);

    const handleItemClick = (e, { name }) =>{ 
        setActiveItem(name)
        router.replace(`/${router.query.contractAdd}`);
    }
    const handleItemClickForLaunch = (e, { name }) =>{ 
        setActiveItem(name)
        router.replace(`/${router.query.contractAdd}/launch`);
    }
    const handleItemClickForEdit = (e, { name }) =>{ 
        setActiveItem(name)
        router.replace(`/${router.query.contractAdd}/edit`);
    }
  
  
      return (
        <Menu  stackable style = {{marginTop : '14px'}}>
            <Menu.Item
                onClick = {()=>{router.push(`/`)}}>
                <img src={`${logo.src}`} />
            </Menu.Item>
          <Menu.Item
            name='Best Buy'
            active
          />
          <Menu.Menu position='right'>
            <Menu.Item
              name='Home'
              onClick={()=>{router.push(`/`)}}
            />
          </Menu.Menu>
        </Menu>
      )
    
}

