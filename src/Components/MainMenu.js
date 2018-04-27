import React from "react";
import { Navbar, FormGroup, Button, ButtonGroup } from 'react-bootstrap';
import LeftNav from './SearchBar/LeftNav'


const MainMenu = ({searchValue,onSearchChange,logout }) => {
  return (
    <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#home">Brand</a>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      
      <Navbar.Form className="searchApp" >
        <LeftNav searchValue={searchValue} onSearchChange={onSearchChange}/>
      </Navbar.Form>

      <Navbar.Form pullRight>
        <FormGroup>
          <ButtonGroup >
          {/* <Button bsStyle = "primary">Profile</Button> */}
          {/* <Button bsStyle = "info">Setting</Button> */}
          <Button bsStyle = "danger" onClick={logout}>Logout</Button>
          </ButtonGroup>
        </FormGroup>
      </Navbar.Form>
    </Navbar.Collapse>
  </Navbar>
  )
}

export default MainMenu
