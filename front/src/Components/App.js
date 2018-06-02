import React from 'react';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Home from './Home';
import Signup from './SignUp';
import Login from './Login';
import './App.css';
import io from 'socket.io-client';
import SocketIOFileClient from 'socket.io-file-client';
import CreateTeam from './Teams/CreateTeam'
// import CopyToClipboardComponent from './Components/CopyToClipboard'
import InviteFriend from './InviteFriend'
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
      teams: [],
      team_id_index:0,
      alert:false,
      team_title:'Your Teams',
      translated_page:{
        team_title:'Your Teams',
        team_options:'Team Options',
        create_team:'Create a Team',
        invite_member:'Invite Member',
        search:'Search',
        send:'Send',
        team_name:'Step:1 Name your team',
        team_choose:'Step:2 Choose your team',
        add:'add',
        remove:'remove',
        create_team_button:'Create a Team',
        skip_button:'Skip',
        logging_error:'Sorry..you are not logged in',
        logout:'Logout'
      },
      typing:true,
      typingText:'',
      showTeams:false,
      showUsers:false,
      showTeamOptions:true,
      showUsersTeam:true
    }
  }

  componentDidMount = () => {

    window.addEventListener('resize', () => {
      if(window.innerWidth <= 840){
        this.setState({ showUsers:true, showTeamOptions:false });
      }
      else{
        this.setState({ showUsers:false, showTeamOptions:true });
      }
    })
    window.addEventListener('resize',() => {
      if(window.innerWidth <= 620){
        this.setState({ showTeams:true, showUsersTeam:false });
      }else{
        this.setState({ showTeams:false, showUsersTeam:true });
      }
    })

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

    socket.on('message:broadcast',(teams) => {
//       const message = {id, text,image,username,date,imagename,team_id, me:false}
//       const messages = this.state.teams[this.state.team_id_index].messages
//       const copyState = Object.assign({},this.state)
//       let user_name = this.state.teams[this.state.team_id_index].teamUsers.find(user => user.username === username)
//       let teamid = this.state.teams.find(team => team.team_id === team_id)
// //      console.log('team_id coming:',team_id,teamid)
      this.setState({teams,status:'success'})
      // this.setState({status:'success'})
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
      // console.log('teams socket on :',teams)
    })
    socket.on('translated:page:success', translated_page => {
      this.setState({translated_page})
    })
    socket.on('someone:typing',(typing,typingText,/*team_id*/) => {
      // console.log("team_id:",team_id)
        let timeout = undefined
        this.setState({typing:typing,typingText})
        if(this.state.typing===false){
          this.setState({typing:false,typingText})
        }else{
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            this.setState({typing:false,typingText})
            }, 5000);
        }
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
    const team_id = this.state.teams[this.state.team_id_index].team_id
    // user_teams.find(team=>team.team_id === this.state.team_id_index)
    const date = this.dateNow()
    const data = { text:message, image:this.state.user.image, username:this.state.user.username, date,team_id, commandType:'message'}
    console.log(data)
    if(image){
      // console.log('upload',image,data,this.state.uploader.upload)
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
  removeTeam = (team) => {
    // console.log('team will be removed:',this.state.team_id_index)
    this.state.socket.emit('remove:team',team)
    // const index = this.state.teams.indexOf(team)
    // if (index < 0) {
    //   return;
    // }
      // const selected = this.state.teams.slice();
      // selected.splice(index, 1);
      // console.log('selected',selected)
      // let copyState2 = Object.assign({},this.state)
      // copyState2.teams = selected 
      // this.setState(copyState2);
  }  
  changeIndex = (team_id_index) => {
//    console.log(team_id_index)
    this.setState({team_id_index})
  }

  closeAlert = () => {
    this.setState({alert:false})
  }

  render(){
    const messages = this.filterMessages()
    // console.log('teams at team_id_index 0: ',this.state.teams[this.state.team_id_index])
    const user_teams = []
    console.log("team_id_index: ",this.state.team_id_index)
    this.state.teams.forEach( team => {
      const userInTeam = team.teamUsers.find( user => user.username === this.state.user.username)
      if(userInTeam){ user_teams.push(team) }
      return;
    })
    let teamID = user_teams.find(team=>team.team_id === this.state.team_id_index)

    return(
          <Switch>
            
            {/* <Route path="/" render={(match) => <Login socket={this.state.socket} history={match.history}  />}/> */}
            <Route path="/invite" render={
              (match) => 
              <InviteFriend 
              history = {match.history}            
              users_list={this.state.user_list}
              user={this.state.user}
              socket={this.state.socket}
              teamUsers={this.state.teamUsers}
              translated_page={this.state.translated_page}
              user_teams={user_teams}
              />
            }/>
            <Route path="/createteam" render={
              (match) => 
            <CreateTeam
              history = {match.history}            
              users_list={this.state.user_list}
              user={this.state.user}
              socket={this.state.socket}
              teamUsers={this.state.teamUsers}
              translated_page={this.state.translated_page}
            />}
            />

            <Route path="/signup" render={
              (match) => 
            <Signup 
              socket={this.state.socket} 
              history={match.history} 
              user_list = {this.state.users}
              uploader={this.state.uploader}
              translated_page={this.state.translated_page}
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
              removeRoom={this.removeTeam}
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
              teams={this.state.teams}
              user_teams={user_teams}
              changeIndex={this.changeIndex}
              currentTeam={this.state.teams[this.state.team_id_index]}
              alert={this.state.alert}
              closeAlert={this.closeAlert}
              translated_page={this.state.translated_page}
              typing={this.state.typing}
              typingText={this.state.typingText}
              // index={this.state.team_id_index}
              teamID={teamID}showUsers
              showTeams={this.state.showTeams}
              showTeamOptions={this.state.showTeamOptions}
              showUsersTeam={this.state.showUsersTeam}
              showUsers={this.state.showUsers}
            />}
            />
            <Route path="/" render={(match) => <Login 
              user_list = {this.state.user_list}
              error={this.state.error} 
              socket={this.state.socket} 
              history={match.history} 
              translated_page={this.state.translated_page}
              />}
              />
          </Switch>
    )
  }

};

export default App;
