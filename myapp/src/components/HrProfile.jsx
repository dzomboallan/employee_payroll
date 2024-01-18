import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/userprofile.css'
import { getAuth,signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore,collection,query,where,getDocs } from 'firebase/firestore';
import { app } from '../firebaseConfig';

const auth = getAuth(app)
const db = getFirestore(app)


function HrProfile() {
    const [showDropdown, setShowDropdown] = useState(false);
    const [userEmail, setUserEmail] = useState('')
    const [userUName, setUserUName] = useState('')
    const navigate = useNavigate()
    const handleDropdownClick = () => {
      setShowDropdown(!showDropdown);
    };

    function handleLogout() {
      signOut(auth)
        if(signOut(auth)){
            alert("logged out")
            navigate('/')
        }else{
            console.error();
            alert('error logging out')
        }
    }

    useEffect(()=> {
      const sub = onAuthStateChanged(auth,(user) =>{
        if(user){
          setUserEmail(user.email)
        }else{
          setUserEmail("")
        }
      })
      return()=>sub
    },[])

    const q = query(collection(db,"hr_admin"),where("email","==",userEmail))
    const promise = getDocs(q)
    promise.then(function(response){
      if(response.docs.length > 0){
        const doc = response.docs[0]
        const data = doc.data()
        setUserUName(data.username)
      }
      else{
        setUserUName("")
      }
    },function(error){
      console.error(error)
    })
  
    return (
      <div className="user-profile-container">
        <div className="user-profile-header">
          <div className="user-profile-header-left">
            <h2>User Profile</h2>
          </div>
          <div className="user-profile-header-right">
            <div className="dropdown">
              <button onClick={handleDropdownClick}>
                <img
                  className="user-profile-header-image"
                  src="https://via.placeholder.com/50x50"
                  alt="User Profile"
                />
              </button>
              {showDropdown && (
                <div className="dropdown-content">
                  <Link to="/hrdash">Home</Link>
                  {/*<Link to="/hr_staff_reg">Add Employee</Link>*/}
                  <Link to="/hr_view_employees">Employee details</Link>
                  <Link to="/hr_view_location">View Location</Link>
                  <Link to="/hr_view_photo">View Photo</Link>
                  {/*<Link to="/hr_set_salary">Set Salary</Link>*/}
                  <Link to="/hr_check_salary">Check Payslips</Link>
                  <Link to="/hrprofile">Your Profle</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="user-profile-body">
          <div className="user-profile-body-left">
            <img
              className="user-profile-body-image"
              src="https://via.placeholder.com/200x200"
              alt="User Profile"
            />
          </div>
          <div className="user-profile-body-right">
            <h3>{userUName}</h3>
            <p>{userEmail}</p>
          </div>
        </div>
      </div>
    );
}

export default HrProfile