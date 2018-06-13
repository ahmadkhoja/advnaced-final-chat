import React from 'react';
import './Home.css';
import MainMenu from './MainMenu';
import Team from './Rooms/Room';
import SingleMessage from './Messages/SingleMessage'
import TeamOptions from './Teams/TeamOptions'
import TeamMember from './Teams/TeamMember'
import { Picker } from 'emoji-mart'
import 'emoji-mart/css/emoji-mart.css'
import { Button, Transition } from 'semantic-ui-react'
import FaGroup from 'react-icons/lib/fa/group'
import FaUserPlus from 'react-icons/lib/fa/user-plus'
class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = { 
      messageText: '',
      visible: false,
      show: false,
      theInputKey:'',
      wrapperclass: 'wrapper',
      colons_list:[],
      isHovering: false,
    }
  }

  handleMouseHover = () => {
    let isHovering = !this.state.isHovering
    this.setState({isHovering})
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible })

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
      if(this.props.currentTeam && this.props.user){
        return (
          this.props.currentTeam.messages.map((message, index) =>
            <SingleMessage  user={this.props.user} lg={this.props.lg} message={message} username={message.username} date={message.date} user_id={message.user_id} body={message.text} key={index} {...message} image={ message.image }
            imagename={message.imagename} colons={this.state.colons_list}/>
          )
        )
      }else{
        return (
          <div className="singleMessage">
            <h1>No User Found Click Here To Login <a href="/">Login</a></h1>
          </div>
        )
      }
    }
  renderUserTeams(){
    if(this.props.user){
      return(
          this.props.user_teams.map((props,index) =>
            // console.log(props.id)
            <Team teamname={props.teamname} changeIndex={ () => this.props.changeIndex(props.team_id)} removeRoom={() => this.props.removeRoom(props)} key={index} {...props} onMouseEnter={this.handleMouseHover} onMouseLeave={this.handleMouseHover} isHovering={this.state.isHovering}/>)
        )
    }else{
      return null
    }
  }
  
  renderTeamUsers(){
    if(this.props.currentTeam){
      return(
        this.props.currentTeam.teamUsers.map( 
          (teamUser,index) => <TeamMember username={teamUser.username} {...teamUser} lang={teamUser.language} image={teamUser.image} key={index} />
        )
      )
    }
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
  addEmoji = (emoji) => {
      // const a = Object.keys(emoji)
      // console.log(a.name)
      // console.log('emoji: '+Object.keys(emoji))
      console.log(emoji)
      const colons = emoji.colons
      this.state.colons_list.push(emoji)
      // console.log("colons list: ",this.state.colons_list)
      this.input.value = this.input.value + " " + colons
  }
  textTyping = (e) => {
    const typing = true
    const typingText = "Some one is typing"
    // const team_id = this.props.teams.team_id
    this.props.socket.emit('user:typing',typing,typingText,/*team_id*/)
    // this.props.socket.emit('user:typing',e.target.message_text.value)
  }
  createTeamPath = () => {
    this.props.history.push('/createteam')
  }
  inviteMemberPath = () => {
    this.props.history.push('/invite')
  }


  render() {
    const teamUsers = this.renderTeamUsers()
    const messages_list = this.renderMessages()
    const users_teams = this.renderUserTeams() 
    return (
      <div>
        <MainMenu  users_teams={users_teams} teamUsers={teamUsers} value={this.props.translated_page.search} logoutTitle={this.props.translated_page.logout} search={this.props.search} logout={this.logout} onSearchChange={this.props.onSearchChange}  visibleTeams={this.props.showTeams} visibleUsers={this.props.showUsers} children={
          <div>
            <p><Button variant="raised" color="primary" className="team-options-links" onClick={this.createTeamPath}><span><FaGroup/></span>{this.props.createTeam}</Button></p>
            <p><Button variant="raised" color="primary" className="team-options-links" onClick={this.inviteMemberPath}><span><FaUserPlus/></span>{this.props.inviteMember}</Button></p>
          </div>
        } />
        {
        this.props.alert ? <div className="alert-not-your-room">
          <span className="closebtn" onClick={this.props.closeAlert}>&times;</span> 
          <strong>Danger!</strong> You are not member of this team
        </div> : null
        }
        <div className={this.state.wrapperclass}>
        
         { this.props.showUsersTeam ? 

            <div className="rooms">
               <h3>{this.props.translated_page.team_title}:</h3>
                { users_teams }
          </div> : null
        }

          <div className="mainChat">
            <div className="mainChatWrapper">
              
              { this.props.status === 'loading' ? 
                <section className="chatRoom upload-loader" ref={(el) => this.messageContainer = el}>
                </section>
               : 
               <section className="chatRoom" ref={(el) => this.messageContainer = el}>
               {messages_list}
               </section>
               }

              <section className="typing">
               <p>{this.props.typing? this.props.typingText : null}</p>
              </section>
              <section className="inputField">
                <form method="post" onSubmit={this.onMessageSubmit} className="inputForm">
                  <div className="inputContainer">
                    <input onChange={this.textTyping} ref={(e) => this.input = e} type="text" name="message_text" className="type" placeholder="Write Something..."  />
                    <label className="fileContainer">
                      <input type="file" id="photo" name="photo" className="message-image" 
                    key={this.state.theInputKey || '' } />
                    </label>
                  <Button content={this.state.visible ? 'Hide' : 'Show'} onClick={this.toggleVisibility}>
                    <img src="https://cdn.shopify.com/s/files/1/1061/1924/products/Hugging_Face_Emoji_2028ce8b-c213-4d45-94aa-21e1a0842b4d_large.png?v=1480481059" style={{height:"87%",width: '86%'}} alt="batata" />
                  </Button>
                  </div>
                  {/* <Divider hidden /> */}
                  <button className="send">{this.props.translated_page.send}</button>
                </form>
                  <Transition visible={this.state.visible} animation='scale' duration={500}>
                    <div className="ui hidden">
                    <Picker onSelect={(emoji) => this.addEmoji(emoji)} />
                    </div>
                  </Transition>
              </section>
            </div>
          </div>
        
            { this.props.showTeamOptions ?
            <div className="teams">
              <div className="memberTeamOptions">
                {this.props.user.image ? <img className="imageTeamSection" src={'//localhost:8888/uploadedImages/'+this.props.user.image} alt="batata" /> : <img className="imageTeamSection" src={'//localhost:8888/uploadedImages/avatar.jpg'} alt="batata" />}
                <label className="usernameTeamSection">{this.props.user.username}({this.props.user.language})</label>
                <TeamOptions 
                teamOptionsTitle={this.props.translated_page.team_options}
                inviteMember={this.props.translated_page.invite_member}
                createTeam={this.props.translated_page.create_team}
                history={this.props.history}
                />
              </div>

              <hr className="red" />

              <div className="teamMembers">
                {teamUsers}
              </div>
            </div>
            : null}
        </div>
       </div>
    );
  }
}

export default Home;
