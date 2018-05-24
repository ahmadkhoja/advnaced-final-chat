import React from 'react'
// import MainMenu from '../MainMenu'
import { Button,Grid,Row,Col,Thumbnail } from 'react-bootstrap'
import './CreateTeam.css'


const UserThumbnail = ({username,image,addUserToTeam,button_value,userClass,text,index,isAdded}) => {
    return(
        <div className={userClass}>       
            <Col xs={6} md={4}>
            <Thumbnail>
            <p className="image-container"><img className="user-image" src={'//localhost:8888/uploadedImages/'+image} alt="batata" /></p>
                <h3 className="user-name" style={{color:'black'}} >{username}</h3>
                <p>
                {!isAdded[index] ? <Button bsStyle="primary" onClick={addUserToTeam}>Add</Button> : <Button bsStyle="primary" onClick={addUserToTeam}>Remove</Button>}
                
                {/* {isAdded ? <Button bsStyle="primary" onClick={removeUserfromTeam}>Added</Button> :<Button bsStyle="primary" onClick={addUserToTeam}>Add</Button>} */}
                {/* <Button bsStyle="primary">Add Friend</Button> */}
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
            teamUsers:[],
            isAdded:[],
            userClass:'user'
        }
    }
    toggleUsers = () => {
        // this.setState({ visible: !this.state.visible })
        if (this.state.userClass === 'user')
            this.setState({userClass:'user-selected'})
        else{
            this.setState({userClass:'user'})
        }
      }
    addUserToTeam = (user) => {
        if (this.state.isAdded.length === 0){ 
            for (var i = 0; i < this.props.users_list.length; i++){
                this.state.isAdded.push(false)
            }
        }
        const arrayindex = this.props.users_list.indexOf(user)
        console.log(arrayindex)
        let isAdded = this.state.isAdded;
        this.toggleUsers()        
        if(!isAdded[arrayindex]){
            isAdded[arrayindex] = true
            this.setState({isAdded})
            this.state.teamUsers.push(user)
            console.log(this.state.isAdded)           
            console.log(this.state.teamUsers)
        }
        else{
             isAdded[arrayindex] = false
             this.setState({isAdded})
             const teamUsers = this.state.teamUsers
             const index = teamUsers.indexOf(user)
             if(index >= 0){
                 teamUsers.splice(index,1)
             }
             this.setState({teamUsers})
             console.log(this.state.isAdded)            
             console.log(this.state.teamUsers)
         }
    }
    renderUsers(){
        return(
            this.props.users_list.map((user,index) => 
                <UserThumbnail username={user.username} image={user.image} key={user.id} addUserToTeam={()=>this.addUserToTeam(user)} userClass={this.state.userClass} index = {index} isAdded = {this.state.isAdded} />
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