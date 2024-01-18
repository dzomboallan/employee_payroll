import React, { useRef, useState } from 'react'
import { Link } from "react-router-dom";
import '../styles/topnav.css'
import '../styles/staffreg.css'
import { app } from '../firebaseConfig';
import { getFirestore,collection, addDoc, Timestamp, getDocs, where, query } from 'firebase/firestore';
import { getAuth, signOut} from 'firebase/auth';

const db = getFirestore(app)
const auth = getAuth(app)

function HrStaffReg(){
    const [empID, setEmpID]=useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [nationalID, setNationalID] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [hireDate, setHireDate] = useState('');
    const[username, setUsername] = useState('');

    function handleLogout(){
        signOut(auth)
        if(signOut(auth)){
            alert("logged out")
        }else{
            console.error();
            alert('error logging out')
        }
    }

    function generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function handleGenerateClick() {
        const generatedString = generateRandomString(8);
        setPassword(generatedString);
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const q = query(collection(db,'employees'),where('EmpId','==',empID), where('Mobile','==',phone),where('Username','==',username),where('Email','==',email))
        const oath = getDocs(q)
        oath.then(function(answer){
            if(answer.docs.length > 0){
                alert('A similar record exists')
                setEmail('')
                setEmpID('')
                setHireDate('')
                setPassword('')
                setPhone('')
                setUsername('')
            }else{
                const dateTimestamp = Timestamp.fromDate(new Date(hireDate))
                const promise = addDoc(collection(db,"employees"),{
                    Email: email,
                    EmpId: empID,
                    Mobile: phone,
                    Password: password,
                    Username: username,
                    date: dateTimestamp
                })
                promise.then(function(response){
                    console.log(response)
                    alert("Employee added successfully")
                    setEmail('')
                    setEmpID('')
                    setHireDate('')
                    setPassword('')
                    setPhone('')
                    setUsername('')
                },function(error){
                    console.error(error)
                    alert("error adding employee ",error)
                })
            }
        },function(error){
            console.error(error)
            alert('error checking employee details for redundancy', error)
        })
    }

    return(
        <div>
            <header className="navbar">
                <Link to="/hrdash">Home</Link>
                {/*<Link to="/hr_staff_reg">Add Employee</Link>*/}
                <Link to="/hr_view_employees">Employee details</Link>
                <Link to="/hr_view_location">View Location</Link>
                <Link to="/hr_view_photo">View Photo</Link>
                {/*<Link to="/hr_set_salary">Set Salary</Link>*/}
                <Link to="/hr_check_salary">Check Salary</Link>
                <Link to="/hrprofile">Your Profle</Link>
                <Link to='/' onClick={handleLogout}>Logout</Link>
            </header>

            <div className='form-container'>
                <form onSubmit={handleSubmit}>
                    <h1>Staff Registration Form</h1>
                    <div className='form-group'>
                        <label htmlFor="empID">Employee ID</label>
                        <input
                            type="text"
                            name="empID"
                            value={empID}
                            onChange={(e) => setEmpID(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="hireDate">Date of Hire</label>
                        <input
                            type="date"
                            name="hireDate"
                            value={hireDate}
                            onChange={(e) => setHireDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="nationalID">National ID</label>
                        <input
                            type="text"
                            name="nationalID"
                            value={nationalID}
                            onChange={(e) => setNationalID(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="phone">Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className='form-group'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="text"
                            name="password"
                            value={password}
                            //onChange={(e) => setPassword(e.target.value)}
                            onClick={handleGenerateClick}
                            required
                            readOnly
                        />
                    </div>

                    <div className='form-group'>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default HrStaffReg