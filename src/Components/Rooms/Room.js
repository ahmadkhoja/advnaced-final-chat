import React from 'react';
import {Button} from 'react-bootstrap';

const Room = ({roomname,removeRoom}) => {
    
return(

    <div className="RoomSection">  
        <div className="room-name">
         <div className="singleRoom" style={{position:'relative'}}>
            <Button bsStyle="info" className="roomNameButton">
                <label className="roomName">{roomname}</label>
            </Button>
            <Button bsStyle="danger" onClick={removeRoom} className="roomCancelButton">X</Button>
         </div>
        </div>
    </div>
    )
}

export default Room;