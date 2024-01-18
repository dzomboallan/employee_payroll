import React, { useState } from 'react';
import '../styles/signup.css'
import { app } from '../firebaseConfig';
import {getFirestore, addDoc, collection} from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const db = getFirestore(app)
const auth = getAuth(app)

//const hrAdminCol = collection(db,"hr_admin")

function UserSignUp(){
    const[username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [key,setKey] = useState('')
    const [role, setRole] = useState('');
    const  requiredKey = 'biDDies'

    const handleSubmit = async (event) =>{
        event.preventDefault()
        //add hr_admin user details to store
        const promise = addDoc(collection(db,"hr_admin"),{
            email: email,
            password: password,
            role: role,
            username: username
        }) 
        promise.then(function(response){
            console.log(response)
            alert("Data sent to firestore successfully")
            setEmail('')
            setKey('')
            setPassword('')
            setUsername('')
            if(response){
                //create  user account
                const oath = createUserWithEmailAndPassword(auth,email,password)                    
                oath.then(function(response){
                    console.log(response)
                    alert("New User Account Created")
                }, function(error){
                    console.log(error)
                    alert('Account creation error ',error)
                })
            }
        }, function(error){
            console.log(error)
            alert('Error sending data to Firestore: ', error)
        })
        
    }

    return(
        <div>
            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h1>User SignUp Form</h1>
                    <div className='form-group'>
                        <label>
                            Key:
                            <input type='password' value={key} onChange={(e) => setKey(e.target.value)} required/>
                        </label>
                    </div>
                    <br/>  
                    <div className='form-group'>
                        <label>
                            Username:
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </label>
                    </div>
                    <br/>
                    <div className='form-group'>
                        <label>
                            Email:
                            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </label>
                    </div>
                    <br/>
                    <div className='form-group'>
                        <label>
                            Password:
                            <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} required/>
                        </label>
                    </div>
                    <br/>
                    <div className='form-group'>
                        <label>
                            Role: 
                            <select value={role} onChange={(e) => setRole(e.target.value)} required>
                                <option value= 'Admin'>Admin</option>
                                <option value='HR'>HR</option>
                            </select>
                        </label>
                    </div>
                    <br/>
                    <div className='form-group'>
                        <button disabled={key !== requiredKey} type='submit' >Register</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default UserSignUp