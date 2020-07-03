import React from "react";
import Particles from "react-particles-js";
import Clarifai from 'clarifai'
import "./App.css";
import Navigation from "./components/navigation/navigation.component";
import Logo from "./components/logo/logo.component";
import ImageForm from "./components/image-form/image-form.component";
import Rank from "./components/rank/rank.component";
import FaceDetection from "./components/face-detection/face-detection.component";
import SignIn from "./components/signin/sign-in.component";
import Register from "./components/register/register.component";

const app = new Clarifai.App({
  apiKey: 'ac0a06c8a8774551a61fd675c50137cb'
 });

const PARTICLE_OPTIONS = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 700,
      },
    },
  },
};
class App extends React.Component {
  constructor(){
    super()
    this.state={
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('inputImage')
    const width = Number(image.width)
    const height = Number(image.height)
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box})
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict('e15d0f873e66047e579f90cf82c9882z', this.state.input)
    .then((response) =>  this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err))
  }
  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedIn: false})
    } else if(route === 'home'){
      this.setState({isSignedIn: true})
    }
    this.setState({route: route})
  }
  render(){
    const {isSignedIn, box, imageUrl, route} = this.state
  return (
    <div className="App">
      <Particles className= 'particles' params = {PARTICLE_OPTIONS} />
      <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange} />
      {route === 'home' ? 
      (<>
        <Logo />
        <Rank />
        <ImageForm onSubmit = {this.onSubmit} onInputChange = {this.onInputChange} />
        <FaceDetection imageUrl = {imageUrl} box = {box}/>
        </>) :
      (route === 'signin'? 
      <SignIn onRouteChange ={this.onRouteChange} /> :
      <Register onRouteChange ={this.onRouteChange} />
      )
      
      }
    </div>
  );}
}

export default App;
