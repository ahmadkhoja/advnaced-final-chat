import React from 'react'

const SingleMessage = ({ image, username, body }) => {
    return (
      <div className="singleMessage">
        <img src={image} alt="batata" className="messageImage" />
        <div className="messageContainer">
          <p className="messageUsername">{username}</p>
          <p className="messageDate">30-4-2018</p>
        </div>
          <p className="bodyText">{body}</p>
      </div>
    )
  }

export default SingleMessage