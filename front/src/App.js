import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './Home';
import Signup from './SignUp';
import Login from './Login';
import './App.css';
import io from 'socket.io-client';
import SocketIOFileClient from 'socket.io-file-client';
import CreateTeam from './Components/Teams/CreateTeam'

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
      uploader:null,
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
      messages: [],
      status:'',
      search:'',
      date: date,
      imagename:null,
      image:'',
      // teamUsers:[],
      // teams:[],
      teams: [
        {
            id:0, 
            teamname:'wind' ,
            teamUsers:[
                {id:0, username:'ahmad',language:'en',password:'batata',image:'ahmad.jpg' /*,team:[]*/},
                {id:3, username:'ali',language:'es',password:'batata'  ,image:'webdev.jpg'/*,team:[]*/}        
            ],
            messages:[
                {id:0, text:'Hello ali',username:'ahmad',language:'en',image:'ahmad.jpg',date:'13:17 PM 5/4/2018'},
                {id:1, text:'Hola Ahmad',username:'ali',language:'es',image:'webdev.jpg',date:'15:17 PM 5/4/2018'},
                {id:2, text:'How are you?',username:'ahmad',language:'en',image:'ahmad.jpg',date:'17:17 PM 5/4/2018'},
            ] 
        },
        {
            id:1,
            teamname:'fire' ,
            teamUsers:[
            {id:1, username:'jad',language:'fr',password:'batata'  ,image:'codi.jpg'  /*,team:[]*/},
            {id:2, username:'omar',language:'tr',password:'batata' ,image:'ai.jpg'    /*,team:[]*/},
            ],
            messages:[
                {id:0, text:'Bonjour Omar',username:'jad',language:'fr',image:'codi.jpg',date:'13:17 PM 3/14/2017'},
                {id:1, text:'Merhaba Jad',username:'omar',language:'tr',image:'ai.jpg',date:'15:17 PM 3/14/2017'},
            ]
        },
    ],
      index:0
    }
  }

  

  componentDidMount = () => {
    const socket = io('http://localhost:8888');//if it wasn't razzle you should do io('http://localhost:3000(or other port)')
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
      const messages = this.state.teams[this.state.index].messages
      const copyState = Object.assign({},this.state)
      let user_name = this.state.teams[this.state.index].teamUsers.find(user => user.username === username)
      if(user_name){
        message.me = true
        messages.push(message)
        copyState.teams[this.state.index].messages = messages
        this.setState({copyState,status:'success'})
      }else{
        alert('you are not in this room')
        this.setState({state:'success'})
      }
    })
    socket.on('user:profile_image',(image) => {
      this.setState({image})
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
    // socket.on('team:created',(roomname,teamUsers) => {
    //   const room = {roomname}
    //   this.state.rooms.push(room)
    //   this.setState({teamUsers})
    // })
    socket.on('teams',(teams) => {
      this.setState({teams})
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
           return date;
      }
           date = hours + ":" + minutes + " AM " + month + "/" + day + "/" + year;
      }
      else {
           date = hours + ":" + minutes + " PM " + month + "/" + day + "/" + year;
      }
    return date
  }

  addMessage = ({message},image) => {
    this.setState({status:'loading'})
    const date = this.dateNow()
    const data = { text:message, image:this.state.user.image, username:this.state.user.username, date }
    if(image){
      console.log('upload',image,data,this.state.uploader.upload)
        this.state.uploader.upload(image,{data:data})
    }else{
      // setTimeout(() => {
        this.state.socket.emit('message',data)
      // }, 1000); 
    }
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
  changeIndex = (index) => this.setState({index})

  render(){
    const messages = this.filterMessages()
    console.log(this.state.teams[this.state.index])
    return(
          <Switch>
            
            {/* <Route path="/" render={(match) => <Login socket={this.state.socket} history={match.history}  />}/> */}
            <Route path="/createteam" render={
              (match) => 
            <CreateTeam
              history = {match.history}            
              users_list={this.state.user_list}
              user={this.state.user}
              socket={this.state.socket}
              teamUsers={this.state.teamUsers}
            />}
            />

            <Route path="/signup" render={
              (match) => 
            <Signup 
              socket={this.state.socket} 
              history={match.history} 
              user_list = {this.state.users}
              uploader={this.state.uploader}
              image={this.state.image}
             />}
            />
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
              imagename={this.state.imagename}
              status={this.state.status}
              // teamUsers={this.state.teamUsers}
              teams={this.state.teams}
              changeIndex={this.changeIndex}
              currentTeam={this.state.teams[this.state.index]}
              // currentTeam={this.state.teams[0]}
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
