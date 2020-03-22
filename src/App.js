import React, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import 'tachyons';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank'
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({apiKey: '8791f72601c0494e98867342687427bc'});
const particlesOptions={
  particles:{
    number:{
      value:100,
      density:{
        enable:true,
        value_area:800
      }
    }
  }
}

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false
    }
  }
  calculateFaceLocation=(data)=>{
    const clarifaiFace=data.outputs[0].data.regions[0].region_info.bounding_box;
    const image=document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return {
      leftCol:clarifaiFace.left_col*width,
      topRow:clarifaiFace.top_row*height,
      rightCol:width-(clarifaiFace.right_col*width),
      bottomRow:height-(clarifaiFace.bottom_row*height)
    }
  }

  displaceFaceBox=(box)=>{
    this.setState({box:box});
    console.log(box);
  }
  onInputChange=(event)=>{
    this.setState({input:event.target.value});
  }
  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input})
    console.log(this.state.imageUrl)
    app.models.predict(Clarifai.FACE_DETECT_MODEL,
        this.state.input
    )
    .then(response=> this.displaceFaceBox(this.calculateFaceLocation(response)))
    .catch(err=>console.log(err));
        // console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
  }
  onRouteChange=(route)=>{
    if(route==='signout'){
      this.setState({isSignedIn:false})
    }else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route})
  }
  render(){
    const {isSignedIn,imageUrl,route,box}=this.state;
    return (
    <div className="App">
        <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/>
        {route==='home'
        ?<div>
          <Logo />
          <Rank />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition  box={box} imageUrl={imageUrl}/>
          </div>
        :(route==='signin')
        ?<Signin onRouteChange={this.onRouteChange}/>
        :<Register onRouteChange={this.onRouteChange}/>
        }
    </div>
    )
  }
}


export default App;
