import React from 'react';
import {Button} from 'react-bootstrap';

const Team = ({teamname,removeRoom,changeIndex}) => {
    
return(

    <div className="RoomSection">  
        <div className="room-name">
         <div className="singleRoom" style={{position:'relative'}}>
            <Button bsStyle="info" className="roomNameButton" onClick={changeIndex}>
                <label className="roomName">{teamname}</label>
            </Button>
            {/* <Button bsStyle="danger" onClick={removeRoom} className="roomCancelButton">X</Button> */}
         </div>
        </div>
    </div>
    )
}

export default Team;