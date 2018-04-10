import React from 'react'

const TeamMember = ({ username, lang }) => {
    return (
      <div className="teamMember">
        <p className="memberUsername">{username}({lang})</p>
      </div>
    )
  }

export default TeamMember;