import SocketIo from 'socket.io'
import translate from 'google-translate-api'
import SocketIOFile from 'socket.io-file'

export default function(server){
    
    // const servers = [
    //     { 
    //         servername:'ai',
    //         image:'ai',
    //         connected:[],
    //         rooms:[
    //             { 
    //                 name:'welcome', 
    //                 users:[],
    //                 messages:[]
    //             }
    //         ]
    //     },
    // ]

    const io = SocketIo(server);
    let ids = 4
    const users = [
        {id:0, username:'ahmad',language:'en',password:'batata'},
        {id:1, username:'jad',language:'fr',password:'batata'},
        {id:2, username:'omar',language:'tr',password:'batata'},
        {id:3, username:'ali',language:'es',password:'batata'},
    ]
    
    const languages = []
    const connected = []

    io.on('connection', (socket) => {

        let uploader = new SocketIOFile(socket, {
            // uploadDir: {			// multiple directories
            // 	music: 'data/music',
            // 	document: 'data/document'
            // },
            uploadDir: 'public/uploaded_images',							// simple directory
            accepts: ['audio/mpeg', 'audio/mp3', 'image/png', 'image/jpg', 'image/jpeg'],		// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
            maxFileSize: 4194304, 						// 4 MB. default is undefined(no limit)
            chunkSize: 10240,							// default is 10240(1KB)
            transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
            overwrite: true 							// overwrite file if exists, default is true.
          });
          uploader.on('start', (fileInfo) => {
            console.log('Start uploading');
            console.log(fileInfo);
          });
          uploader.on('stream', (fileInfo) => {
            console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
          });
          uploader.on('complete', (fileInfo) => {
            console.log('Upload Complete.');
            console.log('file info ----->',fileInfo.name)
            socket.emit('image:name',fileInfo.name)
          });
          uploader.on('error', (err) => {
            console.log('Error!', err);
          });
          uploader.on('abort', (fileInfo) => {
            console.log('Aborted: ', fileInfo);
          });

        let user

        socket.emit('user:list',connected)
        socket.emit('users',users)

        const addUser = (_user) => {
            user = _user
            if(languages.indexOf(user.language)<0){
                languages.push(user.language)
            }
            socket.join(user.language)
            connected.push(user)
            socket.emit('user:list',connected)
        }

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
        

        socket.on('message', (text,image,username,date,imagename) => {
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
        })
    });
}