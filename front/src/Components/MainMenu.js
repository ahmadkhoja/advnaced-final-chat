import React from "react";
import { Navbar, FormGroup, Button, ButtonGroup } from 'react-bootstrap';
import LeftNav from './SearchBar/LeftNav'
import FullScreenDialog from './FullScreenDialog'

const MainMenu = ({searchValue,onSearchChange,logout,value,logoutTitle,teamUsers }) => {
  return (
    <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#home">Brand</a>
      </Navbar.Brand>
      <FullScreenDialog teamUsers={teamUsers}/>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      
      <Navbar.Form className="searchApp" >
        <LeftNav searchValue={searchValue} onSearchChange={onSearchChange} value={value}/>
      </Navbar.Form>

      <Navbar.Form pullRight>
        <FormGroup>
          <ButtonGroup >
          {/* <Button bsStyle = "primary">Profile</Button> */}
          {/* <Button bsStyle = "info">Setting</Button> */}
          {/* <a href="/team_list"><FaCartPlus/>Build Team</a> */}
          <Button bsStyle = "danger" onClick={logout}>{logoutTitle}</Button>
          </ButtonGroup>
        </FormGroup>
      </Navbar.Form>
    </Navbar.Collapse>
  </Navbar>
  )
}

export default MainMenu
