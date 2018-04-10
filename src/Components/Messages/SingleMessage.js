import React from 'react'

const SingleMessage = ({ image, body }) => {
    return (
      <div className="singleMessage">
        <img src={image} alt="batata" className="messageImage" />
        <p className="bodyText">{body}</p>
      </div>
    )
  }

export default SingleMessage