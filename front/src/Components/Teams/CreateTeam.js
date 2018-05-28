import React from 'react'
// import MainMenu from '../MainMenu'
import { Button,Grid,Row,Col,Thumbnail,FormGroup,FormControl  } from 'react-bootstrap'
import './CreateTeam.css'

const UserThumbnail = ({username,image,addUserToTeam,button_value,userClass,text,index,isAdded,add,remove}) => {
    return(
        <div className={userClass}>       
            <Col xs={6} md={4}>
            <Thumbnail>
                <p className="image-container">{image ? <img className="user-image" src={'//localhost:8888/uploadedImages/'+image} alt="batata" />
                :<img className="user-image" src={'/images/'+'avatar.jpg'} alt="batata" /> 
                }
                </p>
                <h3 className="user-name" style={{color:'black'}} >{username}</h3>
                <p>
                {!isAdded[index] ? <Button bsStyle="primary" onClick={addUserToTeam}>{add}</Button> : <Button bsStyle="primary" onClick={addUserToTeam}>{remove}</Button>}
                
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
            userClass:'user',
            teamName:''
        }
    }
    teamNameCahnge = (e) => {
        const teamName = e.target.value
        this.setState({teamName})
    }
    toggleUsers = () => {
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
    CreateTeam = () => {
        // you have the user for auth
        const user = this.props.user        
        if(this.props.user){
            this.state.teamUsers.push(user)
        }
        if(user.username){
            this.props.socket.emit('create:team',this.state.teamName,this.state.teamUsers)
            this.props.history.push ('/home')
        }else{
            alert('Sorry..You are not logged in')
        }
    }
    Skip = () => {
        const user = this.props.user
        if(user.username){
            this.props.history.push('/home')
        }else{
            alert('Sorry..you are not logged in')
        }
    }
    renderUsers(){
        return(
            this.props.users_list.map((user,index) => 
                <UserThumbnail add={this.props.translated_page.add} remove={this.props.translated_page.remove} username={user.username} image={user.image} key={user.id} addUserToTeam={()=>this.addUserToTeam(user)} userClass={this.state.userClass} index = {index} isAdded = {this.state.isAdded} />
            )
        )
    }

    render(){
        const user_list = this.renderUsers()
        console.log(this.state.teamName)
        return(
            <div>
                {/* <MainMenu logout={this.props.logout}/> */}
                <Grid>
                    <Row>
                        <div className="Team-info">
                            <h4>{this.props.translated_page.team_name}:</h4>
                            <FormGroup controlId="formInlineName">
                                <FormControl type="text" name="team-name" onChange={this.teamNameCahnge} placeholder="Name Of Your Team" className="team-name" required/>
                            </FormGroup>
                        </div>
                        <h4 className="choosing-team">{this.props.translated_page.team_choose}:</h4>                        
                        {user_list}
                    </Row>
                </Grid>
                <p className="buttons-section">
                    <Button onClick={this.CreateTeam} bsStyle="success" className="create-team">{this.props.translated_page.create_team_button}</Button>
                    <Button className="create-team" onClick={this.Skip} bsStyle="primary">{this.props.translated_page.skip_button}</Button>
                </p>
                
            </div>
        )
    }
    
}
export default CreateTeam;