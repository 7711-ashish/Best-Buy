import React ,  { useState, useEffect ,useRef } from 'react';
import styles from '../styles/Home.module.css';
import logo from '../public/apple-icon-180x180.png';
import { Button, Card,Input,Segment ,Container} from 'semantic-ui-react';
import { route } from 'next/dist/server/router';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import QrcodeDecoder from 'qrcode-decoder';
import LayoutAdmin from '../components/AdminLayout/LayoutAdmin';


export default function customer(){
	const router = useRouter();
	const [result,setresult]=useState('');
	const QrReader = dynamic(() => import('react-qr-reader'), {
		ssr: false
		})
	const qrRef = useRef(null);


	const handleFileChange =(event)=> {
    const {target} = event;
    const {files} = target;

    if (files && files[0]) {
      const reader = new FileReader();

      //  reader.onloadstart = () => this.setState({loading: true});

      reader.onload = async event => {
       // const img = document.getElementById('img');
      console.log(event.target.result);
      let result;
        try {
          const qr = new QrcodeDecoder();
         result = await qr.decodeFromImage(event.target.result);
        } catch (err) {
          alert("Oops!!! Something went wrong");
        }
        if(result)
	    {	
	    	window.location.href=result.data;
	    }
        console.log("result=="+JSON.stringify(result.data));
      };

      reader.readAsDataURL(files[0]);
    }
  }



	 const handleErrorWebCam = (error) => {
    alert("Oops!!! Something went wrong");
  }
  const handleScanWebCam = (res) => {
  	setresult(res);
  	//console.log(res)
  	if(res)
    {	
    	window.location.href=res;
    }
   }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 

	return(
		<LayoutAdmin>
			<Container>
				<main className={styles.main} style = {{paddingTop : '0px'}}>
					<div className={styles.card}>
						<h4 style={{color:'black',fontSize:'25px'}}>
							Upload your Qr Code
						</h4>
						
						<Input
							id="file"
							type="file"
							accept="image/*"
							onChange={handleFileChange}
						/>
					</div><br/>
					<div className={styles.title} style={{color:'black',fontSize:'35px'}}>
						Scan Your QRcode
					</div><br/>
					<QrReader
							delay={400}
							style={{width: '30%',height:'30%'}}
							onError={handleErrorWebCam}
							onScan={handleScanWebCam}
						/>
						<h5>{result}</h5>
					
				</main>
				
			</Container>
	
		</LayoutAdmin>
		)
}