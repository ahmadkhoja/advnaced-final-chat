import React from 'react';
import { Button, Alert } from 'react-bootstrap';
import FieldGroup from './Components/FieldGroup';
import './LoginForm.css';

export class Login extends React.Component {

    constructor(props){
        super(props)
        this.state ={
            member_lang:'',
            alert:false,
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
        let user_list = this.props.user_list
        // console.log(user_list)
        const user = user_list.find( user => user.username === username && user.password === password )
        if(user){
            this.props.history.push ('/home')
        }else{
            this.setState({alert:true})
        }
        form.user_name.value = '';
        form.user_password.value = '';
    }
    onSignUp = () => {
        this.props.history.push ('/signup')
    }
        // this.props.socket.on('authenticate:no',()=>{
            // return (
                    // <Alert bsStyle="danger">
                    //     <strong>{/*this.props.error*/}</strong> .. check if you put the username and password correctly
                    // </Alert>
                // )    
                // })
        renderDefaultLogin = () => {
            return(
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
                    
                    <Button type="submit" bsStyle= "success" block>Login</Button>
                    <Button type="submit" bsStyle= "success" block onClick={this.onSignUp}>Sign Up Now</Button>
                </form>
            )
        }
        renderNotVerifiedUser = () => {
            return(

                <form onSubmit={this.onFormSubmit}>
                <Alert bsStyle="danger">
                    <strong>{this.props.error}</strong> .. check if you put the username and password correctly
                    <p>
                        Or you can <strong>sign up now here </strong>
                        <Button type="submit" bsStyle= "success" block onClick={this.onSignUp}>Sign Up Now</Button>
                    </p>
                </Alert>
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
            )
        }
        renderLoginPage = () => {
            if(this.state.alert){
              return this.renderNotVerifiedUser()
            }else{
              return this.renderDefaultLogin() 
            }
        }

        render(){
            return (
            <div className="LoginForm">
                {this.renderLoginPage()}
            </div>
            )
        } 
};


export default Login;