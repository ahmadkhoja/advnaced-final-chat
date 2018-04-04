const users = []


export function registerUser(name, password, language){
    return new Promise((ok,no)=>{
        const user = {name,password,language,currentUserId}
        ok(user)
        
        no(new Error('could not register user'))
    })
}


export function authenticateUser(name, password){
    return new Promise((ok,no)=>{
        const user = {name,password,language,currentUserId}
        ok(user)
        
        no(new Error('could not register user'))
    })
}

export function disconnectUser(){

}

export function message(){

}

