import React from 'react'
import { Message } from 'semantic-ui-react';


export default function SomeMessage(props){
    return (
         props.Mess && <Message
            success = {props.Mess.type === 'success' ? true : false}
            negative = {props.Mess.type === 'success' ? false : true}
            header={props.Mess.header}
            content={props.Mess.content}
        />
    );
}
