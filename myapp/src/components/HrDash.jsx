import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/dashboard.css'
import '../styles/topnav.css'
import { app } from "../firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, query, getDocs, collection} from "firebase/firestore";

const db = getFirestore(app)
const auth = getAuth(app)

function HrDash(){
    const [employeeCount,setEmployeeCount] = useState(0)
    const q = query(collection(db,"employees"))
    

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
      }, [])

      const fetchEmployeeCount = async () => {
        const promise = getDocs(q)
        promise.then(function(response){
            const totalEmployees= response.docs.length
            setEmployeeCount(totalEmployees)
        },function(error){
            console.error("error fetching employee count: ",error)
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
                <Link to="/hr_check_salary">Check Payslips</Link>
                <Link to="/hrprofile">Your Profle</Link>
                <Link to='/' onClick={handleLogout}>Logout</Link>
            </header>
            <div className="Dashboard">
                <h1>HR Dashboard</h1>
                <div className="dashboard-card">
                    <h2>Employee Count</h2>
                    <p>{employeeCount}</p>
                </div>
            </div>
        </div>
    )
}
export default HrDash