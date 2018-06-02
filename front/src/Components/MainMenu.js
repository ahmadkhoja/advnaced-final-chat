import React, { Children } from "react";
import { Navbar, FormGroup, Button, ButtonGroup } from 'react-bootstrap';
import LeftNav from './SearchBar/LeftNav'
import TeamUsersDialog from './TeamUsersDialog'
import UsersTeamDialog from './UsersTeamDialog'
import TeamOptionsDialog from './TeamOptionsDialog'

const MainMenu = ({searchValue,onSearchChange,logout,value,logoutTitle,teamUsers,visibleUsers,users_teams,visibleTeams, children }) => {
  return (
    <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#home">Brand</a>
      </Navbar.Brand>
      {visibleUsers ? <TeamUsersDialog teamUsers={teamUsers} /> : null }
      {visibleUsers ? <TeamOptionsDialog children={children} /> : null }
      {visibleTeams ? <UsersTeamDialog users_teams={users_teams} /> : null }
      <Button bsStyle = "danger" onClick={logout}>{logoutTitle}</Button>      
      <Navbar.Toggle />
    </Navbar.Header>
  </Navbar>
  )
}

export default MainMenu
