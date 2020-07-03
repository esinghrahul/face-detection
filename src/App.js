import React from "react";
import Particles from "react-particles-js";
import "./App.css";
import Navigation from "./components/navigation/navigation.component";
import Logo from "./components/logo/logo.component";
import ImageForm from "./components/image-form/image-form.component";
import Rank from "./components/rank/rank.component";

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
  render(){
  return (
    <div className="App">
      <Particles className= 'particles' params = {PARTICLE_OPTIONS} />
      <Navigation />
      <Logo />
      <Rank />
      <ImageForm />
    </div>
  );}
}

export default App;
