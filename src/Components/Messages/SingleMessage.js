import React from 'react'

const SingleMessage = ({ image, username, body, date, imagename }) => {

  return (
      <div className="singleMessage">
        <img src={image} alt="batata" className="messageImage" />
        <div className="messageContainer">
          <p className="messageUsername"> {username}</p>
          <p className="messageDate">{date}</p>
        </div>
        {
          body ? 
          <div classname="message-text">
            <p class="bodyText">{body}</p>
          </div> : null
        }
        {
          imagename ? 
          <img className="bodyImage" src={'/uploaded_images/'+imagename} alt="batata"/> : null
        }
        
         
          
      </div>
    )
  }

export default SingleMessage