import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/userprofile.css'
import { app } from '../firebaseConfig'
import { getFirestore, collection,query,getDocs,where,updateDoc,doc } from 'firebase/firestore'

const db = getFirestore(app) 


function PasswordChange(){
    const [accType,setAccType] = useState('')
    const [userEmail,setUserEmail] = useState("")
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const getCurrentPassword = () => {
        if (accType === "Admin_HR"){
            const q = query(collection(db,"hr_admin"),where("email","==",userEmail))
            const promise = getDocs(q)
            promise.then(function(response){
                if(response.docs.length>0){
                    const docs = response.docs[0]
                    const data = docs.data()
                    setCurrentPassword(data.password)
                }else{
                    setCurrentPassword("")
                }
            },function(error){
                console.error(error)
            })
        }else{
            const q1 = query(collection(db,"employees"),where("Email","==",userEmail))
            const vow = getDocs(q1)
            vow.then(function(answer){
                if(answer.docs.length>0){
                    const docs1 = answer.docs[0]
                    const data1 = docs1.data()
                    setCurrentPassword(data1.Password)
                }else{
                    setCurrentPassword("")
                }
            })
        }
    }
    

    const handlePasswordChange = async (event) =>{
        event.preventDefault()
        if(accType === "Admin_HR"){
            const q = query(collection(db,"hr_admin"),where("email","==",userEmail))
            const promise = getDocs(q)
            promise.then(function(response){
                if(response.docs.length>0){
                    const docs = response.docs[0]
                    const word = updateDoc(doc(db,"hr_admin",docs.id),{
                        password: newPassword
                    })
                    word.then(function(answer){
                        console.log(answer)
                        alert("Password changed successfully")
                        setUserEmail("")
                        setCurrentPassword("")
                        setNewPassword("")
                    },function(error){
                        console.error(error)
                    })
                }else{
                    alert("Record doesnt exist")
                }
            },function(error){
                console.error(error)
            })
        }else{
            const q1 = query(collection(db,"employees"),where("Email","==",userEmail))
            const vow = getDocs(q1)
            vow.then(function(res){
                if(res.docs.length>0){
                    const docs1 = res.docs[0]
                    const say = updateDoc(doc(db,"employees",docs1.id),{
                        Password: newPassword
                    })
                    say.then(function(ans){
                        console.log(ans)
                        alert("password changed successfuly")
                        setUserEmail("")
                        setCurrentPassword("")
                        setNewPassword("")
                    },function(error){
                        console.error(error)
                    })
                }else{
                    alert("rescord doesnt exist")
                }
            },function(error){
                console.error(error)
            })
        }
    }

    return(
        <div className="password-change">
            
            <div className="user-profile-content">
                
                    <h1>Change Password</h1>
                    <Link to="/adminprofile">Back</Link>
                
                <form onSubmit={handlePasswordChange}>
                    <label htmlFor='account-type'>Account type</label>
                    <select value={accType} onChange={(e) => setAccType(e.target.value)} required>
                                <option value= 'Admin_HR'>Admin_HR</option>
                                <option value='Employee'>Employee</option>
                    </select>
                    <label htmlFor="email">Account Email</label>
                    <input
                        type="text"
                        id="email"
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                    />
                    <label htmlFor="current-password">Current Password:</label>
                    <input
                        type="text"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        onClick={getCurrentPassword}
                        required
                        readOnly
                    />
                    <label htmlFor="new-password">New Password:</label>
                    <input
                        type="text"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button type="submit">Change Password</button>
                </form>
            </div>
        </div>
    )
}
export default PasswordChange