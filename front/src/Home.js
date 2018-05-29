import React from 'react';
import './Home.css';
// import CreateServerModal from './Components/Servers/CreateServerModal'
// import Server from './Components/Servers/Server';
import MainMenu from './Components/MainMenu';
// import CreateRoomModal from './Components/Rooms/CreateRoomModal'
import Team from './Components/Rooms/Room';
import SingleMessage from './Components/Messages/SingleMessage'
import TeamOptions from './Components/Teams/TeamOptions'
import TeamMember from './Components/Teams/TeamMember'
// import LeftToRightSidebar from './Components/LeftToRightSidebar'

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
    this.props.socket.emit('user:logout',this.props.user)
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
    let user_name = this.props.user.username
    if(user_name){
      this.props.addMessage({message},imageExists && image)
    }else{
      return
    }
    
    form.message_text.value = '';
    this.functionThatResetsTheFileInput()
  }
  
  renderMessages() {
    let messages = this.props.messages.slice()
    let message = []
    let value = messages.pop()
    message.push(value)
    //  if(this.props.status === 'loading'){
    //   return (
    //     <div className="upload-loader">
    //         {this.props.currentTeam.messages.map((message, index) =>
    //           <SingleMessage  username={message.username} date={message.date} user_id={message.user_id} body={message.text} key={index} {...message} image={'images/' + message.username + '.jpg' }
    //           imagename={message.imagename}/>
    //        )
    //        }
    //        {/* <div className="upload-loader">
            
    //       </div> */}
    //     </div>
    //     )
    // }else{
      if(this.props.currentTeam){
        return (
          this.props.currentTeam.messages.map((message, index) =>
            <SingleMessage  username={message.username} date={message.date} user_id={message.user_id} body={message.text} key={index} {...message} image={ message.image }
            imagename={message.imagename}/>
          )
        )
      }
    }
  // }
  renderUserTeams(){
    return(
        this.props.user_teams.map((props,index) =>
          // console.log(props.id)
          <Team teamname={props.teamname} changeIndex={ () => this.props.changeIndex(props.team_id)} removeRoom={() => this.props.removeRoom(props)} key={index} {...props} />)
      )
  }
  // renderTeams() {      
  //     return(
  //       this.props.teams.map((props,index) =>
  //           <Team teamname={props.teamname} changeIndex={ () => this.props.changeIndex(index)} removeRoom={() => this.props.removeRoom(props)} key={index} {...props} />)
  //         )
  // }
  // renderServers() {
  //   return (
  //     this.props.servers_list.map((props) =>
  //       <Server servername={props.servername} removeServer={() => this.props.removeServer(props)} key={props.servername} {...props} image={'/images/' + props.image + '.jpg'} toggleVisibility={this.toggleVisibility}/>
  //     )
  //   )
  // }
  renderTeamUsers(){
    // console.log('test')
    // console.log('teams--->',this.props.teams)
    // let teamUsers = []
    // console.log('teamUsers',teamUsers)
    // const team = this.props.teams.map.find( team => team === currentTeam)
    
    // const team = this.props.currentTeam
    // const users = team.teamUsers
    // console.log('team',team)
    if(this.props.currentTeam){
//      console.log('this.props.currentTeam.teamUsers-->',this.props.currentTeam.teamUsers)
      return(
        this.props.currentTeam.teamUsers.map( 
          (teamUser,index) => <TeamMember username={teamUser.username} {...teamUser} lang={teamUser.language} image={teamUser.image} key={index} />
        )
      )
    }
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
    // const teams = this.renderTeams()
    const messages_list = this.renderMessages()
    const users_teams = this.renderUserTeams()
    return (
      <div>
        <MainMenu value={this.props.translated_page.search} logoutTitle={this.props.translated_page.logout} search={this.props.search} logout={this.logout} onSearchChange={this.props.onSearchChange}/>
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
          {/* <h3>Your Teams:</h3> */}
          <h3>{this.props.translated_page.team_title}:</h3>
            {/* { users_teams } */}
            { users_teams }
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
              
              { this.props.status === 'loading' ? 
                <section className="chatRoom upload-loader" ref={(el) => this.messageContainer = el}>
                {/* {messages_list} */}
                </section>
               : 
               <section className="chatRoom" ref={(el) => this.messageContainer = el}>
               {messages_list}
               </section>
               }
              {/* <section className="chatRoom" ref={(el) => this.messageContainer = el}>
              {messages_list}
              </section> */}

              <section className="inputField">
                {/* send message */}
                <form method="post" onSubmit={this.onMessageSubmit} className="inputForm">
                


                <div className="inputContainer">
                  <input type="text" name="message_text" className="type" placeholder="Write Something..."  />
                  <input type="file" id="photo" name="photo" className="message-image" 
                  key={this.state.theInputKey || '' } />
                </div>
                  <button className="send">{this.props.translated_page.send}</button>
                </form>
                {/* ------------------------------------------------ */}
                
              </section>
            </div>
          </div>

          <div className="block teams">
            <div className="memberTeamOptions">
              <img className="imageTeamSection" src={'//localhost:8888/uploadedImages/'+this.props.user.image} alt="batata" />
              <label className="usernameTeamSection">{this.props.user.username}({this.props.user.language})</label>
              <TeamOptions 
              teamOptionsTitle={this.props.translated_page.team_options}
              inviteMember={this.props.translated_page.invite_member}
              createTeam={this.props.translated_page.create_team}
              history={this.props.history}
              />
              {/* <label className="roleTeamSection">Team Leader</label> */}
            </div>

            <hr className="red" />

            <div className="teamMembers">
              {teamUsers}
            </div>

          </div>

        </div>
       </div>
    );
  }
}

export default Home;
