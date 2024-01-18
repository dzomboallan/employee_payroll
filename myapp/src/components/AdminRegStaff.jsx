import React, { useRef, useState } from 'react'
import { Link } from "react-router-dom";
import '../styles/topnav.css'
import '../styles/staffreg.css'
import { app } from '../firebaseConfig';
import { getFirestore,collection, addDoc, Timestamp,getDocs, query, where, updateDoc, getDoc, doc} from 'firebase/firestore';
import { getAuth, signOut,createUserWithEmailAndPassword} from 'firebase/auth';

const db = getFirestore(app)
const auth = getAuth(app)

function AdminStaffReg(){
    const [empID, setEmpID]=useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [hireDate, setHireDate] = useState('');
    const[username, setUsername] = useState('');
    const [docId,setDocId] = useState('')
    
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
                    date: dateTimestamp,
                    lastLogin: Timestamp.now().toDate(),
                    lastLogout: Timestamp.now().toDate(),
                    loggedIn: false
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
                
                    const vow = createUserWithEmailAndPassword(auth,email,password)
                    vow.then(function(res){
                        console.log(res)
                        alert('employee user account created')
                        const uid = res.user.uid
                        const docRef = doc(db,"employees",response.id)
                        const word = updateDoc(docRef,{
                            uid: uid
                        })
                        word.then(function(ans){
                            console.log(ans)
                            alert('user account details updated')
                        },function(error){
                            console.error(error)
                        })
                        
                    },function(error){
                        console.error(error)
                    })
                    
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
                <Link to="/admindash">Home</Link>
                <Link to="/admin_staff_reg">Add Employee</Link>
                <Link to="/admin_view_employees">Employee details</Link>
                <Link to="/admin_view_location">View Location</Link>
                <Link to="/admin_view_photo">View Photo</Link>
                <Link to="/admin_set_salary">Set Salary</Link>
                <Link to="/admin_check_salary">Generate Payslip</Link>
                <Link to="/admin_check_payslips">Check Payslips</Link>
                <Link to="/adminprofile">Your Profle</Link>
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
export default AdminStaffReg