import React, { useState } from 'react';
import '../styles/login.css';
import { useNavigate } from 'react-router-dom';
import { app } from '../firebaseConfig';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs} from 'firebase/firestore';

const db = getFirestore(app)
const auth = getAuth(app)

function HrLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    const q = query(collection(db,"hr_admin"),where("email","==",email),where("password","==",password),where("role","==","HR"))
  
    const handleSubmit = async(event) => {
      event.preventDefault();
      //check if email exists in the hr_admin collection 
      const promise = getDocs(q)
      promise.then(function(response){
        //if record does not exist
        if(response.docs.length == 0){
          alert("Incorrect email or password")
        }
        //if record exists login to system, create email session and redirect to admin dashboard
        else{
          signInWithEmailAndPassword(auth,email,password)
          navigate('/hrdash')
        }
        /*
        if(response.exists()){
          const oath = getDoc(q_password)
          oath.then(function(answer){
            if(answer.exists()){
              const vow = getDoc(q_role)
              vow.then(function(copy){
                if(copy.exists()){
                  signInWithEmailAndPassword(auth,email,password)
                  navigate('/admindash')
                }else{
                  alert('Not admin')
                }
              },function(error){
                console.log(error)
                alert("role query error", error)
              })
            }else{
              alert("Incorrect password")
            }
          },function(error){
            console.log(error)
            alert("password query error ", error)
          })
        }else{
          alert("incorrect email")
        }*/
      }, function(error){
        console.log(error)
        alert("query error ",error)
      })
    };
  
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2 className="login-header">Login</h2>
          <label className="login-label" htmlFor="email">Email:</label>
          <input className="login-input" type="emailt" id="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label className="login-label" htmlFor="password">Password:</label>
          <input className="login-input" type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="login-button" type="submit">Login</button>
        </form>
      </div>
    );
  }
  
  export default HrLogin;