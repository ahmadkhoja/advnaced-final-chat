import React from 'react'

const TeamMember = ({ username, lang, image }) => {
    return (
      <div className="teamMember">
        {
          image ? 
          <img className="imageTeamSection" src={'//localhost:8888/uploadedImages/'+image} alt="batata" />: null
        }
        {username}({lang})
      </div>
    )
  }

export default TeamMember;