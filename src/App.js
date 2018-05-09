import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './Home';
import Signup from './SignUp';
import Login from './Login';
import './App.css';
import io from 'socket.io-client';
import SocketIOFileClient from 'socket.io-file-client';



class App extends React.Component {
  
  constructor(props){
    super(props)
    const initialDate = new Date()
    const day = initialDate.getUTCDay()
    const month = initialDate.getMonth()+1
    const year = initialDate.getFullYear()
    let hours = initialDate.getHours();
    const minutes = initialDate.getMinutes()
    let date = ''
    if (hours < 10){
            date = '0' + hours + ":" + minutes + " AM " + month + "/" + day + "/" + year;
    }else if(hours < 12){
            date = hours + ":" + minutes + " AM " + month + "/" + day + "/" + year;
    }else {
            date = hours + ":" + minutes + " PM " + month + "/" + day + "/" + year;
    }
    
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
        {username:'ahmad',text:'hello',image:'ahmad',date:'20-10-2017',imagename:''},
        {username:'ahmad',text:'bonjour',image:'ahmad',date:'20-10-2017',imagename:''},
        {username:'ahmad',text:'me llamo ahmad',image:'ahmad',date:'20-10-2017',imagename:''},
      ],
      search:'',
      date: date,
    }
  }

  

  componentDidMount = () => {
    const socket = io();//if it wasn't razzle you should do io('http://localhost:3000(or other port)')
    const uploader = new SocketIOFileClient(socket);
    uploader.on('start', (fileInfo) => {
      console.log('Start uploading', fileInfo);
    });
    uploader.on('stream', (fileInfo) => {
      console.log('Streaming... sent ' + fileInfo.sent + ' bytes.');
    });
    uploader.on('complete', (fileInfo) => {
      console.log('Upload Complete', fileInfo);
    });
    uploader.on('error', (err) => {
      console.log('Error!', err);
    });
    uploader.on('abort', (fileInfo) => {
      console.log('Aborted: ', fileInfo);
    })

    this.setState({uploader})
    this.setState({socket})
    
    socket.on('message:broadcast',(id,text,image,username,date,imagename) => {
      const message = {id, text,image,username,date,imagename, me:false}
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
  
  onChange = (evt) => {
    this.setState({search:evt.target.value})
  }
  filterMessages = () => {
    // this.props.messages
    const search = this.state.search.trim();
    if(!search){ return this.state.messages }
    const regex = new RegExp(search,'i');
     return this.state.messages.map(
      (message) => {
        const { username,text,date } = message
        const key = [username,text,date].join(' ');
        message.key = key;
        message.id = key;
        return message
      }
    ).filter(message => regex.test(message.key) )
    
  }
  dateNow = () => {
    const initialDate = new Date()
    const day = initialDate.getUTCDay()
    const month = initialDate.getMonth()+1
    const year = initialDate.getFullYear()
    
    let hours = initialDate.getHours();
    const minutes = initialDate.getMinutes()
        
    const fullDate = []
    fullDate.push(day,month,year)
    let date = ''
    // if(hours === 0){
    //   hours = 12
    // }
    if (hours < 12){
      if(hours < 10){
           date = '0' + hours + ":" + minutes + " AM           " + month + "/" + day + "/" + year;
           this.setState({date});
           return;
      }
           date = hours + ":" + minutes + " AM " + month + "/" + day + "/" + year;
      }
      else {
           date = hours + ":" + minutes + " PM " + month + "/" + day + "/" + year;
      }
    
    this.setState({date})
  }

  addMessage = ({message},imagename) => {
  this.dateNow()
  this.state.socket.emit('message',message,'ahmad',this.state.user.username,this.state.date,imagename)
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
    const messages = this.filterMessages()
    return(
          <Switch>
            
            {/* <Route path="/" render={(match) => <Login socket={this.state.socket} history={match.history}  />}/> */}
            <Route path="/signup" render={(match) => <Signup 
            socket={this.state.socket} 
            history={match.history} 
            user_list = {this.state.user_list}
            /*addUser={this.addUser}*/ />}/>
            <Route path="/home" render={
              (match)=>
            <Home
              history = {match.history}
              users_list={this.state.users}
              servers_list={this.state.servers}
              addNewServer={this.addNewServer}
              removeServer={this.removeServer}
              removeRoom={this.removeRoom}
              addNewRoom={this.addNewRoom}
              rooms_list={this.state.rooms}
              addMessage={this.addMessage}
              messages={messages}
              user={this.state.user}
              onSearchChange={this.onChange}
              uploader={this.state.uploader}
              socket={this.state.socket}
            />}
            />
            <Route path="/" render={(match) => <Login 
            user_list = {this.state.user_list}
            error={this.state.error} 
            socket={this.state.socket} 
            history={match.history} />}/>
          </Switch>
    )
  }

};

export default App;
