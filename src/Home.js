import React from 'react';
import './Home.css';
import CreateServerModal from './Components/Servers/CreateServerModal'
import Server from './Components/Servers/Server';
import Menu from './Components/Menu';
import CreateRoomModal from './Components/Rooms/CreateRoomModal'
import Room from './Components/Rooms/Room';
import { Button, Modal, Glyphicon } from 'react-bootstrap';


const SingleMessage = ({ image, body }) => {
  return (
    <div className="singleMessage">
      <img src={image} alt="batata" className="messageImage" />
      <p className="bodyText">{body}</p>
    </div>
  )
}

class TeamOptions extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <div className="teamOptions">

        <button className="optionTeamSection" onClick={this.handleShow}>
          <Glyphicon glyph="align-justify" />
        </button>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Team Options </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <Button vertical block>Build New Team</Button> */}
            <Button vertical block>Share Your Code</Button>
            <Button vertical block>To Do List</Button>
            <Button vertical block>Invite New Member</Button>
            <Button vertical block>Remove Member</Button>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}


const TeamMember = ({ username, lang }) => {
  return (
    <div className="teamMember">
      <p className="memberUsername">{username}({lang})</p>
    </div>
  )
}

class Home extends React.Component {

  constructor(props) {
    super(props)
    this.state = { messageText: '' }
  }

  onTextChange = (evt) => {
    this.setState({ messageText: evt.target.value })
    evt.target = ''
    // console.log(this.state.messageText)
  }

  // newMessage = <SingleMessage />
  // getRef = (element) => this.newMessage = element;

  // messageEnd = <SingleMessage />

  // scrollToBottom = () => {

  //   const batata = this.messageEnd.scrollIntoView({ behavior: "smooth" });
  //   console.log(this.batata)
  // }

  // componentDidMount = () => {
  //     this.scrollToBottom();      
  // }
  // componentDidUpdate() {
  //   this.scrollToBottom();
  // }


  onMessageSubmit = (evt) => {
    evt.preventDefault();
    const form = evt.target;
    const message = form.message_text.value;;
    this.props.addMessage(message)
    form.message_text.value = "";
  }
  renderMessages() {
    return (
      this.props.messages.map((props, index) =>
        <SingleMessage user_id={this.props.user_id} body={props.text} key={index} {...props} image={'/images/' + props.image + '.jpg'} />
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
        <Menu />
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

                {/* <div 
                        ref={(el) => { this.messagesEnd = el; }}>
                      </div> */}


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
