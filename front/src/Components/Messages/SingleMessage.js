import React from 'react'

const SingleMessage = ({ image, username, body, date, imagename }) => {

  return (
      <div className="singleMessage">
        <img src={image} alt="images/avatar.jpg" className="messageImage" />
        <div className="messageContainer">
          <p className="messageUsername"> {username}</p>
          <p className="messageDate">{date}</p>
        </div>
        {
          body ? 
          <div className="message-text">
            <p className="bodyText">{body}</p>
          </div> : null
        }
        {
          imagename ? 
          <img className="bodyImage" src={'//localhost:8888/uploadedImages/'+imagename} alt="batata"/> : null
        }
        
         
          
      </div>
    )
  }

export default SingleMessage