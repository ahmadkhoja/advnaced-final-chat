// The port where the server is running on
const port = 8888;
// Importing HTTP package to create a server for socket  
const http = require('http')
// Importing Express package to create a server the application  
const express = require('express')
// Assigning app to be the express server and has express functions
const app = express()
// Creating the server by http and putting the app in it (so sockets can work)
const server = http.createServer(app)
// Importing Socket (for live chat)
const SocketIo = require('socket.io')
// Importing Google Translate API (as it's name --> translation library from google)
const translate = require('google-translate-api')
// Importing Socket file (for socket to upload and recieve files)
const SocketIOFile = require('socket.io-file')
// Assigning io to be the socket and giving it the server
const io = SocketIo(server);
// Importing fs which is for saving to data.json and loading
const fs = require('fs')
// Assigning a static server that serves images from folder "uploadedImages" in http://localhost:8888/uploadedImages
app.use('/uploadedImages',express.static('./uploadedImages'))
// Giving access to any other server to send and recive from this server
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
// At url="localhost:8888/" ==> output: "Welcome to this new project"
app.get('/',(req,res) => {
    res.send("Welcome to this new project")
})
    // ids used for incrementing and assigning to users
    let ids = 4
    // ids used for incrementing and assigning to teams
    let team_ids = 2
    // All the users in this app
    let users = [
        {id:0, username:'ahmad',language:'en',password:'batata',image:'ahmad.jpg' /*,team:[]*/},
        {id:1, username:'jad',language:'fr',password:'batata'  ,image:'codi.jpg'  /*,team:[]*/},
        {id:2, username:'omar',language:'tr',password:'batata' ,image:'ai.jpg'    /*,team:[]*/},
        {id:3, username:'ali',language:'es',password:'batata'  ,image:'webdev.jpg'/*,team:[]*/},
    ]
    // All the teams in this app
    let teams = [
        {
            team_id:0, 
            teamname:'wind' ,
            teamUsers:[
                {id:0, username:'ahmad',language:'en',password:'batata',image:'ahmad.jpg' /*,team:[]*/},
                {id:3, username:'ali',language:'es',password:'batata'  ,image:'webdev.jpg'/*,team:[]*/}        
            ],
            messages:[
                {id:0, text:'Hello ali',username:'ahmad',language:'en',image:'ahmad.jpg',date:'13:17 PM 5/4/2018',team_id:0},
                {id:1, text:'Hola Ahmad',username:'ali',language:'es',image:'webdev.jpg',date:'15:17 PM 5/4/2018',team_id:0},
                {id:2, text:'How are you?',username:'ahmad',language:'en',image:'ahmad.jpg',date:'17:17 PM 5/4/2018',team_id:0},
            ] 
        },
        {
            team_id:1,
            teamname:'fire' ,
            teamUsers:[
            {id:1, username:'jad',language:'fr',password:'batata'  ,image:'codi.jpg'  /*,team:[]*/},
            {id:2, username:'omar',language:'tr',password:'batata' ,image:'ai.jpg'    /*,team:[]*/},
            ],
            messages:[
                {id:0, text:'Bonjour Omar',username:'jad',language:'fr',image:'codi.jpg',date:'13:17 PM 3/14/2017',team_id:1},
                {id:1, text:'Merhaba Jad',username:'omar',language:'tr',image:'ai.jpg',date:'15:17 PM 3/14/2017',team_id:1},
            ]
        },
    ]
// As it looks it a function to save our data for persistence
const save = () => {
    // It uses fs to save in data.json the following {ids, team_ids, users, teams} as a String
    fs.writeFileSync('../data.json',JSON.stringify({ids, team_ids, users, teams},null,2))
}

// As it looks it a function to load our data
const load = () => {
    // It uses fs to read the data.json
    const data_string = fs.readFileSync('../data.json',{encoding:'utf8'})
    // Checking if it's empty
    if(!data_string){
    // If empty throw an error
        throw new Error('file is empty')
    }
    //  Return the following {ids, team_ids, users, teams} as JavaScript Objects
    const data = JSON.parse(data_string)
    teams = data.teams
    users = data.users
    ids = data.ids
    team_ids = data.team_ids
}
 
// Calling the load function
load()

// Calling the save function every second
setInterval(save,1000)

    // All the languages
    const languages = []
    // All the Connected Users
    const connected = []

    io.on('connection', (socket) => {
        // output: user connected
        console.log('user connected')
        
        let user
        const addUser = (_user) => {
            user = _user
            if(languages.indexOf(user.language)<0){
                languages.push(user.language)
            }
            socket.join(user.language)
            connected.push(user)
            socket.emit('user:list',connected)
        }

        const sendMessage = ({text,image,username,date,imagename,team_id}) => {
            if(!user){ return; }
            let message = { text,image,username,date,imagename,team_id, me:false }
            // let messages = []
            // const messages = teams[team_id].messages
            const user_name = teams[team_id].teamUsers.find(user => user.username === username)
            const teamid = teams.find(team => team.team_id === team_id)

            if(user_name && teamid){
              message.me = true
            //   messages.push(message)
            teams[team_id].messages.push(message)
            
            const promises = languages.map( lg => {
                if( lg !== user.language ){
                    return translate(text, { from:user.language, to:lg })
                        .then( ({text}) => {
                            message[lg] = text
                            io.emit('lg',lg)
                        })
                        .catch( err => { throw err })
                }else{
                    message[lg] = text
                    return Promise.resolve()
                }
            })

            Promise.all(promises)
                .then( () => {
                    console.log(message)
                    io.emit('message:broadcast',teams)
                })
                .catch( err => console.log(err))
        }else{
            throw new Error('not user or not in the same teams')
        }
    }

        let uploader = new SocketIOFile(socket, {
            // uploadDir: {			// multiple directories
            // 	music: 'data/music',
            // 	document: 'data/document'
            // },
            // uploadDir: '../front/public/uploaded_images',							// simple directory
            uploadDir: './uploadedImages',							// simple directory
            accepts: ['audio/mpeg', 'audio/mp3', 'image/png', 'image/jpg', 'image/jpeg'],		// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
            maxFileSize: 4194304, 						// 4 MB. default is undefined(no limit)
            chunkSize: 10240,							// default is 10240(1KB)
            transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
            overwrite: true 							// overwrite file if exists, default is true.
          });
          uploader.on('start', (fileInfo) => {
            console.log('Start uploading');
            // console.log(fileInfo);
          });
          uploader.on('stream', (fileInfo) => {
            // console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
          });
          uploader.on('complete', (fileInfo) => {
            console.log('Upload Complete.');
            const operation = fileInfo.data.commandType
            if(operation === 'message'){
                const messageData = { ...fileInfo.data, imagename:fileInfo.name }
                setTimeout(() => {
                    sendMessage(messageData)
                },1000)
            }else if(operation === 'signup'){
                const signUpData = { ...fileInfo.data, image:fileInfo.name }
                const { username, password, language, image } = signUpData
                const user = { username, password, language, image, id:ids++ }
                users.push(user)
                socket.emit('signup:ok',user)
                addUser(signUpData)
            }
          });
          uploader.on('error', (err) => {
            console.log('Error!', err);
          });
          uploader.on('abort', (fileInfo) => {
            console.log('Aborted: ', fileInfo);
          });

        socket.emit('user:list',connected)
        socket.emit('users',users)
        socket.on('signup', ( username, password, language ) =>{
            const user = { username, password, language, id:ids++ }
            users.push(user)
            addUser(user)
            socket.emit('signup:ok',user)
        });
        
        socket.on('authenticate',(username,password)=>{
            console.log(username,password)
            const user = users.find((user)=>user.username === username && user.password === password)
            if(!user){
                socket.emit('authenticate:no')
                return
            }
            addUser(user)
            socket.emit('authenticate:ok',user)
            
        })

        const removeUserFromConnected = (user) => {
            const index = connected.indexOf(user)
            if(index < 0 ){
                return; // user was not found
            }
            connected.splice(index,1)
        }

        socket.on('disconnect', function(){
            if(!user){ return }

            removeUserFromConnected(user)
            
             const room = io.sockets.adapter.rooms[user.language];
            if(room && room.length <= 0 ){
                const index = languages.indexOf(user.language);
                if(index < 0 ){ return }
                languages.splice(index,1); 
            }
        });
        
        
        socket.on('message', (data)=>{
            sendMessage(data)
        } )
        
        socket.emit('teams',teams)

        socket.on('invite:user:to:team',(friends,selectedTeam) => {
            // console.log('friends',friends)
            selectedTeam = parseInt(selectedTeam)
            const index = teams.findIndex(({team_id})=>team_id === selectedTeam)
            console.log('team_ids',teams.map(team=>team.team_id))
            if(index < 0){
                throw new Error('team `'+selectedTeam+'` not found')
            }
            // console.log('index',index)
            // a = [...a,...b]
            teams[index].teamUsers = [...teams[index].teamUsers,...friends]
            socket.emit('teams',teams)
            // console.log(teams)
        })
        socket.on('create:team',(teamname,teamUsers) => {
            const team = {teamname,teamUsers,messages:[],team_id:team_ids++}
            // console.log('team:',team)
            teams.push(team)
            socket.emit('teams',teams)
            // console.log('teams--->',teams)
            // const messages = []
            // socket.emit('team:created',teamname,teamUsers,messages)
        })

        socket.on('remove:team', (team) => {
            const index = teams.find(t =>t.team_id === team.team_id)
            console.log("remove team index:",index.team_id)
            if(index<0){
                return;
            }
            teams.splice(index,1)
            console.log("teams after one is removed",teams)
            // socket.emit('teams',teams)
        })        
        socket.on('user:logout',(user) => {
            const index = connected.indexOf(user)
            connected.splice(index,1)
            console.log('connected',connected)
        })
        // team_title,team_options,create_team,invite_member,search,send,team_name,team_choose,add,remove,create_team_button,skip_button,logging_error,logout
        // socket.on('user:typing',(typing,typingText/*,team_id*/) => {
        //     // io.emit('someone:typing',typing,typingText)
        //     // console.log('team_id',team_id)
        //     // const team = teams.find(team => team.team_id === team_id)
        //     // if(team){
        //         const promises = languages.forEach( lg => {
    
        //             if( lg === user.language && user.language && user ){
        //                 io.to(lg).emit('someone:typing',typing,typingText/*,team_id*/)
        //                 // .then((text) =>  io.to(lg).emit('someone:typing',text,typing))
        //                 // .catch( err => console.error(err))
        //             }else{
        //                 translate(typingText, { from:user.language, to:lg })
        //                     .then( ({text}) => io.to(lg).emit('someone:typing',typing,text/*,team_id*/)
        //                     )
        //                     .catch( err => console.error(err))
        //             }
        //         })  
        //     // }else{
        //     //     throw new Error("not team")
        //     // }
        //     // Promise.all(promises)
        //     // .then(()=>socket.emit('translated:page:success',translated_page)  )
        //     // .catch((err)=>{ throw err })
        // })
        socket.on('translated:page', titlesObject => {
            // console.log(team_title)
            if(!user){ return; }
            languages.forEach( lg => {
                if( lg === user.language && user.language ){
                    const translated_page = {}
                    const titlesArray = Object.keys(titlesObject)
                    // ['team_title','team_options','create_team','invite_member','search','send','team_name', 'team_choose','add','remove','create_team_button','skip_button','logging_error','logout']
                    
                    const promises = titlesArray.map( key => {
                        const originalText = titlesObject[key]
                        return translate(originalText, { to:user.language })
                        .then( ({text}) => 
                            translated_page[key] = text || originalText                        
                        )
                        .catch((err)=>{throw err})
                    })
                    
                    Promise.all(promises)
                        .then(()=>socket.emit('translated:page:success',translated_page)  )
                        .catch((err)=>{ throw err })
                }
            })  
        })
        
    });



server.listen(port,(err) => {
    if(err){
        console.log(err)
    }
    console.log(`Running on port ${port}`)
})
