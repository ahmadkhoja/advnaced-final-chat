import React from 'react';
import './Home.css';
import CreateServerModal from './Components/Servers/CreateServerModal'
import Server from './Components/Servers/Server';
import Menu from './Components/Menu';
import CreateRoomModal from './Components/Rooms/CreateRoomModal'
import Room from './Components/Rooms/Room';
import SingleMessage from './Components/Messages/SingleMessage'
import TeamOptions from './Components/Teams/TeamOptions'
import TeamMember from './Components/Teams/TeamMember'


class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = { 
      messageText: '',
    }
  }

  onTextChange = (evt) => {
    this.setState({ messageText: evt.target.value })
    evt.target = ''
  }

  onMessageSubmit = (evt) => {
    evt.preventDefault();
    const form = evt.target;
    const message = form.message_text.value;
    if(message === ''){
      return;
    }
    this.props.addMessage(message)
    form.message_text.value = "";
  }
  renderMessages() {
    return (
      this.props.messages.map((props, index) =>
        <SingleMessage user_id={this.props.user_id} body={props.text} key={index} {...props} image={'/images/' + props.image + '.jpg'}/>
      )
    )
  }
  renderRooms() {
    return (
      this.props.rooms_list.map((props) =>
        <Room roomname={props.roomname} removeRoom={() => this.props.removeRoom(props)} key={props.roomname} {...props} />
      )
    )
  }
  renderUsers() {
    return (
      this.props.users_list.map((props, index) =>
        <TeamMember username={props.name} user_id={this.state.user_id} {...props} lang={props.language} key={props.username} />
      )
    )
  }
  renderServers() {
    return (
      this.props.servers_list.map((props) =>
        <Server servername={props.servername} removeServer={() => this.props.removeServer(props)} key={props.servername} {...props} image={'/images/' + props.image + '.jpg'} />
      )
    )
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
    const user_list = this.renderUsers()
    const server_list = this.renderServers();
    const room_list = this.renderRooms()
    const messages_list = this.renderMessages()

    return (
      <div>
        <Menu search={this.props.search} onSearchChange={this.props.onSearchChange}/>
        <div className="wrapper">
          <div className="servers">
            <h3>Servers </h3>
            <hr />
            <CreateServerModal addNewServer={this.props.addNewServer} />
            <div className="serverSectionContainer">
              {server_list}
            </div>
          </div>
          <div className="rooms">

            <h3>
              Rooms
                      <hr />
              <CreateRoomModal addNewRoom={this.props.addNewRoom} />
            </h3>
            <div className="roomSectionContainer">
              {room_list}
            </div>

          </div>

          <div className="block mainChat">
            <div className="mainChatWrapper">
              <section className="chatRoom" ref={(el) => this.messageContainer = el}>
                  {messages_list}
              </section>

              <section className="inputField">
                <form method="post" onSubmit={this.onMessageSubmit} className="inputForm">
                  <input type="text" name="message_text" value={this.props.messageText} onChange={this.onTextChange} className="type" placeholder="Write Something..." />
                  {/* <input type="file" name="message_image" value={this.state.messageImage} onChange={this.onImageChange} className="upload" placeholder="Write Something..."/> */}
                  <button className="send">Send</button>
                </form>
              </section>
            </div>
          </div>

          <div className="block teams">
            <div className="memberTeamOptions">
              <img className="imageTeamSection" src="images/ahmad.jpg" alt="batata" />
              <label className="usernameTeamSection">{this.props.user.username}({this.props.user.language})</label>
              <TeamOptions />
              <label className="roleTeamSection">Team Leader</label>
            </div>

            <hr className="red" />

            <div className="teamMembers">
              {user_list}
            </div>

          </div>

        </div>
      </div>
    );
  }
}

export default Home;
