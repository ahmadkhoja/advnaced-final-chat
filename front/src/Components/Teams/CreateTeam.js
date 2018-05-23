import React from 'react'
import MainMenu from '../MainMenu'
import { Button,Grid,Row,Col,Thumbnail } from 'react-bootstrap'
import './CreateTeam.css'

const UserThumbnail = ({username,image}) => {
    return(
        <div className="main">       
            <Col xs={6} md={4}>
            <Thumbnail>
            <p className="image-container"><img className="user-image" src={'//localhost:8888/uploadedImages/'+image} alt="batata" /></p>
                <h3 className="user-name" style={{color:'black'}} >{username}</h3>
                <p>
                <Button bsStyle="primary">Add Friend</Button>
                {/* <Button bsStyle="default">Button</Button> */}
                </p>
            </Thumbnail>
            </Col>
        </div>
    )
}


class CreateTeam extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            
        }
    }
    
    renderUsers(){
        return(
            this.props.users_list.map((user) => 
                <UserThumbnail username={user.username} image={user.image} key={user.id} />
            )
        )
    }

    render(){
        const user_list = this.renderUsers()
        return(
            <div>
                <Grid>
                    <Row>
                        {user_list}
                    </Row>
                </Grid>
            </div>
        )
    }
    
}
export default CreateTeam;