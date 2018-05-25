import React from 'react';
import './Home.css';
import CreateServerModal from './Components/Servers/CreateServerModal'
import Server from './Components/Servers/Server';
import MainMenu from './Components/MainMenu';
import CreateRoomModal from './Components/Rooms/CreateRoomModal'
import Room from './Components/Rooms/Room';
import SingleMessage from './Components/Messages/SingleMessage'
import TeamOptions from './Components/Teams/TeamOptions'
import TeamMember from './Components/Teams/TeamMember'
import LeftToRightSidebar from './Components/LeftToRightSidebar'

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = { 
      messageText: '',
      visible: false,
      show: false,
      theInputKey:'',
      wrapperclass: 'wrapper',
      // tmp_message: {
      //   message: '',
      //   imagename: ''
      // }
    }
  }
  // componentDidMount = () => {
  //   this.props.socket.on('image:name',(imagename) => {
  //       this.props.addMessage({message:this.state.tmp_message.message},imagename)
  //   })
  // }
  toggleVisibility = () => {
    this.setState({ visible: !this.state.visible })
    if (this.state.wrapperclass === 'wrapper')
      this.setState({wrapperclass: 'wrapperclick'})
    else
      this.setState({wrapperclass: 'wrapper'})
  } 
  handleClick() {
    this.setState({
      show: !this.state.show
    });
  }

  logout = () => {
    this.props.history.push('/')
  }

  onTextChange = (evt) => {
    this.setState({ messageText: evt.target.value })
    evt.target = ''
  }
  functionThatResetsTheFileInput = () => {
    let randomString = Math.random().toString(36);
    
      this.setState({
        theInputKey: randomString
      })
  }
  onMessageSubmit = (evt) => {
    evt.preventDefault();
    const form = evt.target;
    const message = form.message_text.value;
    const image = form.photo.files
    const imageExists = !!image.length // undefined | File(filename, data, )

    if(message === '' && !imageExists){
      return;
    }
    
    this.props.addMessage({message},imageExists && image)
    form.message_text.value = '';
    this.functionThatResetsTheFileInput()
  }
  
  renderMessages() {
    let messages = this.props.messages.slice()
    let message = []
    let value = messages.pop()
    message.push(value)
     if(this.props.status === 'loading'){
      return (
        <div className="upload-loader">
            {this.props.currentTeam.messages.map((message, index) =>
              <SingleMessage  username={message.username} date={message.date} user_id={message.user_id} body={message.text} key={index} {...message} image={'images/' + message.username + '.jpg' }
              imagename={message.imagename}/>
           )
           }
           {/* <div className="upload-loader">
            
          </div> */}
        </div>
        )
    }else{
      return (
        this.props.currentTeam.messages.map((message, index) =>
          <SingleMessage  username={message.username} date={message.date} user_id={message.user_id} body={message.text} key={index} {...message} image={ message.image }
          imagename={message.imagename}/>
        )
      )
    }
  }
  // renderRooms() {
  //   return (
  //     this.props.rooms_list.map((props) =>
  //       <Room roomname={props.roomname} removeRoom={() => this.props.removeRoom(props)} key={props.roomname} {...props} />
  //     )
  //   )
  // }
  renderRooms() {
    return (
      this.props.teams.map((props,index) =>
        <Room teamname={props.teamname} changeIndex={ () => this.props.changeIndex(index)} removeRoom={() => this.props.removeRoom(props)} key={index} {...props} />
      )
    )
  }
  renderServers() {
    return (
      this.props.servers_list.map((props) =>
        <Server servername={props.servername} removeServer={() => this.props.removeServer(props)} key={props.servername} {...props} image={'/images/' + props.image + '.jpg'} toggleVisibility={this.toggleVisibility}/>
      )
    )
  }
  renderTeamUsers(){
    // console.log('test')
    // console.log('teams--->',this.props.teams)
    // let teamUsers = []
    // console.log('teamUsers',teamUsers)
    // const team = this.props.teams.map.find( team => team === currentTeam)
    
    // const team = this.props.currentTeam
    // const users = team.teamUsers
    // console.log('team',team)
    return(
      this.props.currentTeam.teamUsers.map( 
        (teamUser,index) => <TeamMember username={teamUser.username} {...teamUser} lang={teamUser.language} image={teamUser.image} key={index} />
      )
    )
    // return(
    //   teamUsers.map((teamUser,index) => <TeamMember username={teamUser.username} {...teamUser} lang={teamUser.language} image={teamUser.image} key={index} />)
    // )
  }

  goToBottom(){
    this.messageContainer.scrollTop = this.messageContainer.scrollHeight
  }

  componentDidUpdate(){
    this.goToBottom();
  }

  componentDidMount(){
    this.goToBottom();
  }

  render() {
    // const user_list = this.renderUsers()
    const teamUsers = this.renderTeamUsers()
    // const server_list = this.renderServers();
    const room_list = this.renderRooms()
    const messages_list = this.renderMessages()
    return (
      <div>
        <MainMenu search={this.props.search} logout={this.logout} onSearchChange={this.props.onSearchChange}/>
        {
        this.props.alert ? <div className="alert-not-your-room">
          <span className="closebtn" onClick={this.props.closeAlert}>&times;</span> 
          <strong>Danger!</strong> You are not member of this team
        </div> : null
        }
        <div className={this.state.wrapperclass}>
          {/* <div className="servers">
            {/* <h3>Servers </h3> */}
            {/* <CreateServerModal addNewServer={this.props.addNewServer} />
            <div className="serverSectionContainer">
              {server_list}
            </div>
          </div> */}  
                  {/* ****************Sidebar Start******************* */}
          <div className="rooms">
          <h3>Your Teams:</h3>
            {room_list}
          </div>
          {/* <LeftToRightSidebar visible={this.state.visible} show={this.state.show}>
          <div>

            <h3>
              <CreateRoomModal addNewRoom={this.props.addNewRoom} />
            </h3>
            <div className="roomSectionContainer">
              {room_list}
            </div>

          </div>
          </LeftToRightSidebar> */}

          {/* ****************Sidebar Ends******************* */}

          <div className="block mainChat">
            <div className="mainChatWrapper">
              <section className="chatRoom" ref={(el) => this.messageContainer = el}>
                  {messages_list}
              </section>

              <section className="inputField">
                {/* send message */}
                <form method="post" onSubmit={this.onMessageSubmit} className="inputForm">
                


                <div className="inputContainer">
                  <input type="text" name="message_text" className="type" placeholder="Write Something..."  />
                  <input type="file" id="photo" name="photo" className="message-image" 
                  key={this.state.theInputKey || '' } />
                </div>
                  <button className="send">Send</button>
                </form>
                {/* ------------------------------------------------ */}
                
              </section>
            </div>
          </div>

          <div className="block teams">
            <div className="memberTeamOptions">
              <img className="imageTeamSection" src={'//localhost:8888/uploadedImages/'+this.props.user.image} alt="batata" />
              <label className="usernameTeamSection">{this.props.user.username}({this.props.user.language})</label>
              <TeamOptions />
              <label className="roleTeamSection">Team Leader</label>
            </div>

            <hr className="red" />

            <div className="teamMembers">
              {teamUsers}
            </div>

          </div>

        </div>
      // </div>
    );
  }
}

export default Home;
