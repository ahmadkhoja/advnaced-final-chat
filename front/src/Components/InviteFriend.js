import React from 'react'
// import MainMenu from '../MainMenu'
import { Button,Grid,Row,Col,Thumbnail,FormGroup,FormControl  } from 'react-bootstrap'
// import './InviteFriend.css'
import CopyToClipboardComponent from './CopyToClipboard'

const UserThumbnail = ({username,image,inviteFriend,button_value,userClass,text,index,isAdded,add,remove}) => {
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
                {!isAdded[index] ? <Button bsStyle="primary" onClick={inviteFriend}>{add}</Button> : <Button bsStyle="primary" onClick={inviteFriend}>{remove}</Button>}
                
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
            friends:[],
            isAdded:[],
            userClass:'user',
            teamName:'',
            value:'',
            selectedTeam:{}
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
      inviteFriend = (user) => {
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
            this.state.friends.push(user)
            console.log(this.state.isAdded)           
            console.log(this.state.friends)
        }
        else{
             isAdded[arrayindex] = false
             this.setState({isAdded})
             const friends = this.state.friends
             const index = friends.indexOf(user)
             if(index >= 0){
                 friends.splice(index,1)
             }
             this.setState({friends})
             console.log(this.state.isAdded)            
             console.log(this.state.friends)
         }
    }
    chooseTeam = (team) => {
        console.log('team',team)
        const copyState = Object.assign({},this.state)
        copyState.selectedTeam = team
        this.setState(copyState)
        console.log(this.state.selectedTeam)
    }
    ProceedInvitaion = () => {
        // you have the user for auth
        const user = this.props.user
        
        if(user.username){
            this.props.socket.emit('invite:user:to:team',this.state.friends,this.state.selectedTeam)
            this.props.history.push ('/home')
        }else{
            alert('Sorry..You are not logged in')
        }
    }
    changeValue = (e) => {
        const value = e.target.value
        this.setState({value})
    }
    returnHome = () => {
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
                <UserThumbnail add={this.props.translated_page.add} remove={this.props.translated_page.remove} username={user.username} image={user.image} key={user.id} inviteFriend={()=>this.inviteFriend(user)} userClass={this.state.userClass} index = {index} isAdded = {this.state.isAdded} />
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
                            <h4>Step:1 Choose which team you want your friends to join it</h4>
                            <FormGroup controlId="formInlineName">
                                <FormControl value={this.state.value} componentClass="select" className="team-name" placeholder="Select" style={{color:"black"}} onChange={this.changeValue}>
                                <option>Select</option>
                                    {
                                        this.props.user_teams.map((user_team) => 
                                            <option value={user_team.teamname} onClick={() =>this.chooseTeam(user_team)}>{user_team.teamname}</option>
                                        )
                                    }
                                </FormControl>
                            </FormGroup>
                        </div>
                        <h4 className="choosing-team">Choose Your Friends:</h4>                        
                        {user_list}
                    </Row>
                </Grid>
                <p className="buttons-section">
                    <Button onClick={this.ProceedInvitaion} bsStyle="success" className="create-team">Continue</Button>
                    <Button className="create-team" onClick={this.returnHome} bsStyle="primary">Return Home</Button>
                </p>
                
            </div>
        )
    }
    
}
export default CreateTeam;