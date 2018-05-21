import React from 'react';
import {Button} from 'react-bootstrap';

const Server = ({servername,image,removeServer,toggleVisibility}) => {
    return(

        <div className="ServerSection">
          
            <div className="server-name">
            {/* {console.log(image)} */}

                <Button bsStyle="info" className="serverNameButton" onClick={toggleVisibility}>
                <img src={image} alt='batata' className="server-icon"/>
                </Button> 
                <Button onClick={removeServer} bsStyle="danger" className="removeServerButton">X</Button>
                {/* <h4>{servername}</h4> */}
            </div>
        </div>
    )
}

export default Server;