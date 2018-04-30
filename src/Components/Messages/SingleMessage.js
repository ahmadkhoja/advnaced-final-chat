import React from 'react'

const SingleMessage = ({ image, username, body, date }) => {

  return (
      <div className="singleMessage">
        <img src={image} alt="batata" className="messageImage" />
        <div className="messageContainer">
          <p className="messageUsername">{username}</p>
          <p className="messageDate">{date}</p>
        </div>
          <p className="bodyText">{body}</p>
      </div>
    )
  }

export default SingleMessage