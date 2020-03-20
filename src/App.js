import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';

firebase.initializeApp(firebaseConfig);

function App() {
const [user, setUser] = useState({
  isSignedIn: false,
  name:"", 
  email:"", 
  photo: ""
})
 
  const  provider = new firebase.auth.GoogleAuthProvider();
  const handleSingIn = () => {
    firebase.auth().signInWithPopup(provider)
    .then (res =>{
      const {displayName, photoURL, email} = res.user;
      const signedIntUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedIntUser);
     console.log(displayName, email, photoURL);
    })
    .catch(err => {
      console.log(err);
      console.log(err.message);
    })
    
  }
  const handleSingInOut = () =>{
    firebase.auth().signOut()
    .then(res => {
      const signedOutUser = {
        isSignedIn: false,
        name: "",
        photo: "",
        email: "",
        password: "",
        error:"",
        isValid: false,
        existingUser: false
      }
      setUser(signedOutUser);
      console.log(res);
    })
  .catch( err =>{

  })
  }

const is_valid_email = email => /^.+@.+\..+$/.test(email);
const hasNumber = input => /\d/.test(input);

const switchFrom = e =>{
  const createdUser = {...user};
  createdUser.existingUser= e.target.checked;
  setUser(createdUser);
  
  
}
  const handleChange = e =>{
    const newUserInfo = {
      ...user
    };
    // perfrom validation
    let isValid = true;
    if(e.target.name === "email"){
      isValid = is_valid_email(e.target.value);
    }
   if (e.target.name === "password"){
     isValid = e.target.value.length > 8 && hasNumber(e.target.value);
   }
    console.log(e.target.user);

   newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  const createAccount =(event) =>{
    
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn= true;
        createdUser.error = "";
        setUser(createdUser);
      })
      .catch(err =>{
      console.log(err.message);
      const createdUser = {...user};
      createdUser.isSignedIn = false;
      createdUser.error = err.message;
      setUser(createdUser);

      })
    }
    
    
    event.preventDefault();
    event.target.reset();
  }

  const signedInUser = event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res => {
        console.log(res);
        const createdUser = {...user};
        createdUser.isSignedIn= true;
        createdUser.error = "";
        setUser(createdUser);
      })
      .catch(err =>{
      console.log(err.message);
      const createdUser = {...user};
      createdUser.isSignedIn = false;
      createdUser.error = err.message;
      setUser(createdUser);

      })
    }
    event.preventDefault();
    event.target.reset();
  }
  return (
    <div className="App">
    { 
     user.isSignedIn ? <button onClick={handleSingInOut}> Sing out</button> :
      <button onClick={handleSingIn}> Sing in</button>
     }
      {
        user.isSignedIn &&
        <div>
           <p>Welcome {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo}  alt=""/>
           </div>
      }
      <h1>Our own  Authentication</h1>
      <input type="checkbox" name="switchFrom" onChange={switchFrom} id="switchFrom"/>
      <label htmlFor="switchFrom"> Returing user </label>
         
     
      <form style={{display:user.existingUser ? "block": "none"}} onSubmit={signedInUser}>
       
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required/>
        <br/>
        <input type="submit" value="Sign in"/>
      </form>
      <form style={{display:user.existingUser ? "none": "block"}} onSubmit={createAccount}>
        <input type="text" onBlur={handleChange} name="name" placeholder="Your Name" required/>
        <br/>
        <input type="text" onBlur={handleChange} name="email" placeholder="Your Email" required/>
        <br/>
        <input type="password" onBlur={handleChange} name="password" placeholder="Your Password" required/>
        <br/>
        <input type="submit" value="Create Account"/>
      </form>
      {
        user.error && <p style= {{color:"red"}}>{user.error}</p>
      }
    </div>
  );
}

export default App;
