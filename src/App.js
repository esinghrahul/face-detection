import React from "react";
import Particles from "react-particles-js";
import "./App.css";
import Navigation from "./components/navigation/navigation.component";
import Logo from "./components/logo/logo.component";
import ImageForm from "./components/image-form/image-form.component";
import Rank from "./components/rank/rank.component";
import FaceDetection from "./components/face-detection/face-detection.component";
import SignIn from "./components/signin/sign-in.component";
import Register from "./components/register/register.component";


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

const INITIAL_STATE = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends React.Component {
  constructor(){
    super()
    this.state= INITIAL_STATE
  }

  loadUser= (data)=> {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
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

  onPictureSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch('https://face-detectionnow-api.herokuapp.com/imageUrl',{
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              input: this.state.input
          })
      })
    .then(response=> response.json())
    .then((response) =>  {
      if(response){
        fetch('https://face-detectionnow-api.herokuapp.com/image',{
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
              id: this.state.user.id
          })
      })
      .then(response => response.json())
      .then(count=> {
        this.setState(Object.assign(this.state.user, {entries: count}))
      })
    }
      this.displayFaceBox(this.calculateFaceLocation(response))})
    .catch(err => console.log(err))
  }
  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState(INITIAL_STATE)
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
        <Rank name={this.state.user.name} entries= {this.state.user.entries} />
        <ImageForm onSubmit = {this.onPictureSubmit} onInputChange = {this.onInputChange} />
        <FaceDetection imageUrl = {imageUrl} box = {box}/>
        </>) :
      (route === 'signin'? 
      <SignIn onRouteChange ={this.onRouteChange} loadUser= {this.loadUser} /> :
      <Register onRouteChange ={this.onRouteChange} loadUser = {this.loadUser}/>
      )
      
      }
    </div>
  );}
}

export default App;
