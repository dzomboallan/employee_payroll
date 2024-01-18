import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/dashboard.css'
import '../styles/topnav.css'
import { app } from "../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, collection,where} from "firebase/firestore"
import {getStorage,ref,listAll} from 'firebase/storage'

const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

function AdminDash(){
    const [employeeCount,setEmployeeCount] = useState(0)
    const [loggedInUsers, setLoggedInUsers] = useState(0)
    const [spaceUsage, setSpaceUsage] = useState(0)
    const q = query(collection(db,"employees"))
    const q1 = query(collection(db,"employees"),where("loggedIn","==",true))

    function handleLogout(){
        signOut(auth)
        if(signOut(auth)){
            alert("logged out")
        }else{
            console.error();
            alert('error logging out')
        }
    }

    useEffect(() => {
        fetchEmployeeCount()
        fetchLoggedInUsers()
        fetchUsage()
      }, [])

      const fetchEmployeeCount = async () => {
        const promise = getDocs(q)
        promise.then(function(response){
            const totalEmployees= response.docs.length
            setEmployeeCount(totalEmployees)
        },function(error){
            console.error(error)
        })
      }

      const fetchLoggedInUsers = async () => {
        const vow = getDocs(q1)
        vow.then(function(answer){
            const loggedInEmployees = answer.docs.length
            setLoggedInUsers(loggedInEmployees)
        },function(error){
            console.error(error)
        })

      }

      const fetchUsage = async () => {
        const listRef = ref(storage,'/')
        const promise = listAll(listRef)
        promise.then(function(response){
            const storedItems = response.items.length
            setSpaceUsage(storedItems)
        },function(error){
            console.error(error)
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
            <div className="Dashboard">
                <h1>Admin Dashboard</h1>
                <div className="dashboard-card">
                    <h2>Employee Count</h2>
                    <p>{employeeCount}</p>
                </div>
                <div className="dashboard-card">
                    <h2>Logged in users</h2>
                    <p>{loggedInUsers}</p>
                </div>
                <div className="dashboard-card">
                    <h2>Files Stored</h2>
                    <p>{spaceUsage}</p>
                </div>
            </div>
        </div>
    )
}
export default AdminDash