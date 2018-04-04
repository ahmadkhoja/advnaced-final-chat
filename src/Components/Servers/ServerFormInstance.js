import React from 'react';
import { Button } from 'react-bootstrap';
import FieldGroup from '../FieldGroup';
// import {ImageUploader} from 'react-image-upload'

// class ImageUpload extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       file: '',
//       imagePreviewUrl: ''
//     };
//     this._handleImageChange = this._handleImageChange.bind(this);
//     this._handleSubmit = this._handleSubmit.bind(this);
//   }

//   _handleSubmit(e) {
//     e.preventDefault();
//     // TODO: do something with -> this.state.file
//   }

//   _handleImageChange(e) {
//     e.preventDefault();

//     let reader = new FileReader();
//     let file = e.target.files[0];

//     reader.onloadend = () => {
//       this.setState({
//         file: file,
//         imagePreviewUrl: reader.result
//       });
//     }

//     reader.readAsDataURL(file)
//   }
  

//   render() {
//     let { imagePreviewUrl } = this.state;
//     let $imagePreview = null;
//     if (imagePreviewUrl) {
//       $imagePreview = (<img src={imagePreviewUrl} />);
//     }

//     return (
//       <div>
//         <form onSubmit={this._handleSubmit}>
//           <input type="file" onChange={this._handleImageChange} />
//           <button type="submit" onClick={this._handleSubmit}>Upload Image</button>
//         </form>
//         {$imagePreview}
//       </div>
//     )
//   }

// }

class ServerFormInstance extends React.Component {

  constructor(props){
    super(props)
    this.state = {
  
    }
  }
  // uploadImage = (imageFile)  =>{
  //   return new Promise((resolve, reject) => {
  //     let imageFormData = new FormData();
  
  //     imageFormData.append('imageFile', imageFile);
      
  //     var xhr = new XMLHttpRequest();
      
  //     xhr.open('post', '/upload', true);
      
  //     xhr.onload = function () {
  //       if (this.status == 200) {
  //         resolve(this.response);
  //       } else {
  //         reject(this.statusText);
  //       }
  //     };
      
  //     xhr.send(imageFormData);
  
  //   });
  // }

  onFormSubmit = (evt) =>{
    // console.log("batata")
    evt.preventDefault();
    const form = evt.target;
    const servername = form.server_name.value;
    // const image = form.server_image.value;
    // this.uploadImage(image)
    // console.log('server name: ',servername,'image: ',image)
    // form.server_name.value = "";
    // form.server_image.value = "";
    this.props.addNewServer(servername,'codi.jpg');
  }

  
  render(){
    return (<div>
      <form onSubmit={this.onFormSubmit}>
      <FieldGroup
        id="formControlsText"
        name="server_name"
        type="text"
        label="Server Name"
        placeholder="Enter Your Server Name"
      />
      
      {/* <FieldGroup
        id="formControlsFile"
        name="server_image"
        type="file"
        label="Upload Image:"
      /> */}
       {/* <ImageUpload/> */}
      <Button type="submit" bsStyle= "success">Create Server</Button>
      </form>
    </div>
    )
  } };

  
    export default ServerFormInstance;