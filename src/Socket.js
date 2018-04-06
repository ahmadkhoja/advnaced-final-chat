import SocketIo from 'socket.io'
import translate from 'google-translate-api'

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

        let user
        let room
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
            
             room = io.sockets.adapter.rooms[user.language];
            if(room && room.length <= 0 ){
                const index = languages.indexOf(user.language);
                if(index < 0 ){ return }
                languages.splice(index,1); 
            }
        });


        socket.on('message', (text) => {
            if(!user){ return; }
            languages.forEach( lg => {
                if( lg === user.language ){
                    io.to(lg).emit('message:broadcast',user.id,text)  
                        
                }else{
                    translate(text, { from:user.language, to:lg })
                        .then( ({text}) => 
                            io.to(lg).emit('message:broadcast',user.id,text)
                        )
                        .catch( err => console.error(err))
                }
            })
        })


    });
}