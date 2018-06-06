import React from 'react'

const TeamMember = ({ username, lang, image }) => {
    return (
      <div className="teamMember">
        {
          image ? 
          <img className="image-friend" src={'//localhost:8888/uploadedImages/'+image} alt="batata" />: 
          <img className="image-friend" src={'//localhost:8888/uploadedImages/avatar.jpg'} alt="batata" />
        }
        <span className="teammember-name">{username}({lang})</span>
      </div>
    )
  }

export default TeamMember;