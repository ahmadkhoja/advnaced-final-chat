import React from 'react'
import { Emoji } from 'emoji-mart'

const SingleMessage = ({ image, username, body, date, imagename, colons, message, lg, user }) => {
  const text = ( (user.language === lg && message[lg]) ? message[lg] : body )
  const renderedText = text && text.split(" ").map(
    (word) => {  
      const colon = colons.find((colon)=>colon.colons === word)
      if(colon){
        return <Emoji emoji={colon.colons} size={16} />
      }else{
        return <span style={{marginRight:'0'}} > { word } </span>
      }
    }
  )
  console.log('SINGLEMESSAGE -- ',{renderedText,text,body,lg,message:message[lg],colons})
  return (
      <div className="singleMessage">
        {
          image ? 
          <img className="profileImage" src={'//localhost:3023/uploadedImages/'+image} alt="batata"/> :
          <img className="profileImage" src={'//localhost:3000/images/avatar.jpg'} alt="batata"/>
        }
        <div className="messageContainer">
          <p className="messageUsername"> {username}</p>
          <p className="messageDate">{date}</p>
        </div>
        {
          renderedText ? 
          <div className="message-text">
            <p className="bodyText">{ renderedText }</p>
          </div> : null
        }
        {
          imagename ? 
          <img className="bodyImage" src={'//localhost:3023/uploadedImages/'+imagename} alt="batata"/> : null
        }
        
         
          
      </div>
    )
  }

export default SingleMessage