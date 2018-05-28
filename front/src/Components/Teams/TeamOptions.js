import React from 'react'
import { Button, Modal, Glyphicon } from 'react-bootstrap';
import './TeamOptions.css'
import FaGroup from 'react-icons/lib/fa/group'
import FaUserPlus from 'react-icons/lib/fa/user-plus'
// import FaUserTimes from 'react-icons/lib/fa/user-times'
class TeamOptions extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.state = {
        show: false
      };
    }
  
    handleClose() {
      this.setState({ show: false });
    }
  
    handleShow() {
      this.setState({ show: true });
    }
  
    render() {
      return (
        <div className="teamOptions">
  
          <button className="optionTeamSection" onClick={this.handleShow}>
            <Glyphicon glyph="align-justify" />
          </button>
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Team Options </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <Button vertical block>Build New Team</Button> */}
              {/* <Button vertical block>Share Your Code</Button> */}
              {/* <Button vertical block>To Do List</Button> */}
              <p><a className="team-options-links" href="/createteam"><span><FaGroup/></span>Create a Team</a></p>
              <p><a className="team-options-links" href="/invite"><span><FaUserPlus/></span>Invite Member</a></p>
              {/* <p><a className="team-options-links" href="/remove"><span><FaUserTimes/></span>Remove Member</a></p> */}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }

  export default TeamOptions;