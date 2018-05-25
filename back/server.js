const port = 8888;
const http = require('http')
const express = require('express')
const app = express()
const server = http.createServer(app)
const SocketIo = require('socket.io')
const translate = require('google-translate-api')
const SocketIOFile = require('socket.io-file')
const io = SocketIo(server);

app.use('/uploadedImages',express.static('./uploadedImages'))
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get('/',(req,res) => {
    res.send("Welcome to this new project")
})
    let ids = 4
    let team_ids = 2
    const users = [
        {id:0, username:'ahmad',language:'en',password:'batata',image:'ahmad.jpg' /*,team:[]*/},
        {id:1, username:'jad',language:'fr',password:'batata'  ,image:'codi.jpg'  /*,team:[]*/},
        {id:2, username:'omar',language:'tr',password:'batata' ,image:'ai.jpg'    /*,team:[]*/},
        {id:3, username:'ali',language:'es',password:'batata'  ,image:'webdev.jpg'/*,team:[]*/}
    ]
    //id,text,image,username,date,imagename
    const teams = [
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
    ]
    
    const languages = []
    const connected = []

    io.on('connection', (socket) => {
        
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

        const sendMessage = ({text,image,username,date,imagename}) => {
            if(!user){ return; }
            
            languages.forEach( lg => {
                if( lg === user.language ){
                    io.to(lg).emit('message:broadcast',user.id,text,image,username,date,imagename)  
                        
                }else{
                    translate(text, { from:user.language, to:lg })
                        .then( ({text}) => 
                            io.to(lg).emit('message:broadcast',user.id,text,image,username,date,imagename)
                        )
                        .catch( err => console.error(err))
                }
            })
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
            const messageData = { ...fileInfo.data, imagename:fileInfo.name }
            const signUpData = { ...fileInfo.data, image:fileInfo.name }
            // socket.emit('user:profile_image',fileInfo.name)
            console.log(signUpData)
            setTimeout(() => {
                sendMessage(messageData)
            },1000)
            // console.log(signUpData)
            const { username, password, language, image } = signUpData
            const user = { username, password, language, image }
            socket.emit('signup:ok',user)
            addUser(signUpData)
            // console.log('file info ----->',messageData)
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
        
        
        socket.on('message', sendMessage )
        
        socket.emit('teams',teams)
        socket.on('create:team',(teamname,teamUsers) => {
            const team = {teamname,teamUsers,messages:[],team_ids:team_ids++}
            console.log('team:',team)
            teams.push(team)
            socket.emit('teams',teams)
            // console.log('teams--->',teams)
            // const messages = []
            // socket.emit('team:created',teamname,teamUsers,messages)
        })
    });



server.listen(port,(err) => {
    if(err){
        console.log(err)
    }
    console.log(`Running on port ${port}`)
})
