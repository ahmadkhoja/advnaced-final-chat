import React from 'react';
import { Button } from 'react-bootstrap';
import FieldGroup from './Components/FieldGroup';
import './LoginForm.css';

export class Login extends React.Component {

    constructor(props){
        super(props)
        this.state ={
            member_lang:'',
        }
    }
    onChange = (event) => {
        this.setState({member_lang: event.target.value});
    }
    
    onFormSubmit = (evt) =>{
        evt.preventDefault();
        const form = evt.target;
        const username = form.user_name.value;
        const password = form.user_password.value;

        this.props.socket.emit('authenticate',username,password)
        this.props.history.push ('/home')
    }

  render(){
    return (
    <div className="LoginForm">
      <form onSubmit={this.onFormSubmit}>
      <FieldGroup
        name="user_name"
        type="text"
        label="User Name"
        placeholder="Enter Your UserName"
        required
      />
      <FieldGroup
        name="user_password"
        type="password"
        label="Your Password: "
        placeholder="Enter The password.."
        required
      />
      
        <Button type="submit" bsStyle= "success" vertical block>Login</Button>
      </form>
    </div>
    )
  } };


export default Login;