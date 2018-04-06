import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './Home';
import Signup from './SignUp';
import Login from './Login';
import './App.css';
import io from 'socket.io-client';




class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      socket:null,
      servers: [
        {servername:'ai',image:'ai'},
        {servername:'codi',image:'codi'},
        {servername:'webdev',image:'webdev'},
      ],
      rooms: [
        {roomname:'Welcome'},
        {roomname:'General'},
        {roomname:'Web Development'},
      ],
      user:{},
      user_list:[],
      error:'',
      users :[],
      messages: [
        {text:'hello',image:'ahmad'},
        {text:'bonjour',image:'ahmad'},
        {text:'me llamo ahmad',image:'ahmad'},
      ],
    }
  }

  componentDidMount = () => {
    const socket = io();
    this.setState({socket})
    
    socket.on('message:broadcast',(id,text) => {
      const message = {id, text, me:false}
      if(id === this.state.user.id){
        message.me = true
      }
      const messages = [...this.state.messages, message]
      this.setState({messages})
    })
    
    socket.on('signup:ok',(user)=>{
      this.setState({user})
    })

    socket.on('authenticate:ok',(user)=>{
      this.setState({user})
    })

    socket.on('authenticate:no',(user)=>{
      this.setState({error:'User is not found'})
    })
    
    socket.on('users',(users) => {
      this.setState({user_list:users})
    })
    socket.on('user:list', users => {
      this.setState({users})
    })
  }
  addMessage = (message) => {
    this.state.socket.emit('message',message)
  }
  addNewServer = (servername,image) => {
    const new_server = {servername,image};
    const serversAdded = this.state.servers;
    serversAdded.push(new_server);
    this.setState({servers:serversAdded});
  }
  addNewRoom = (roomname) => {
    const new_room = {roomname};
    const roomsAdded = this.state.rooms;
    roomsAdded.push(new_room);
    this.setState({rooms:roomsAdded});
  }
  removeServer = (server) => {
    const index = this.state.servers.indexOf(server)
    if (index < 0) {
      return;
    }
      const selected = this.state.servers.slice();
      selected.splice(index, 1);
      this.setState({ servers:selected });
  }
  removeRoom = (room) => {
    const index = this.state.rooms.indexOf(room)
    if (index < 0) {
      return;
    }
      const selected = this.state.rooms.slice();
      selected.splice(index, 1);
      this.setState({ rooms:selected });
  }  
  render(){
    return(
          <Switch>
            <Route path="/signup" render={(match) => <Signup socket={this.state.socket} history={match.history} /*addUser={this.addUser}*/ />}/>
            <Route path="/login" render={(match) => <Login 
            user_list = {this.state.user_list}
            // users = {this.state.users}
            error={this.state.error} 
            socket={this.state.socket} 
            history={match.history} /*addUser={this.addUser}*/ />}/>
            <Route path="/" render={
              ()=>
            <Home 
              users_list={this.state.users}
              servers_list={this.state.servers}
              addNewServer={this.addNewServer}
              removeServer={this.removeServer}
              removeRoom={this.removeRoom}
              addNewRoom={this.addNewRoom}
              rooms_list={this.state.rooms}
              addMessage={this.addMessage}
              messages={this.state.messages}
              user={this.state.user}
            />}
            />
          </Switch>
    )
  }

};

export default App;
