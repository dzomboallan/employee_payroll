import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/topnav.css'
import '../styles/staffdetails.css'
import { app } from "../firebaseConfig";
import { getFirestore,getDocs,query,collection, deleteDoc,doc,where } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

const db = getFirestore(app)
const auth = getAuth(app)

function AdminCheckPayslip(){
    const [data, setData] = useState([]);

    function handleLogout() {
        signOut(auth)
        if(signOut(auth)){
            alert("logged out")
        }else{
            console.error();
            alert('error logging out')
        }
    }

    useEffect(() => {
        const fetchData = async() =>{
            const response = await getDocs(collection(db,"payslips"))
            const values = response.docs.map((item) => ({
                id: item.id,
                empId: item.data().empId,
                date: item.data().date.toDate(),
                hourly_wage: item.data().hourly_wage,
                paid: item.data().paid,
                work_hours: item.data().work_hours
            }))
            setData(values)
        }
        fetchData()    
    },[])

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

            <div className="table">
                <table>
                    <thead>
                        <tr>
                        <th>EmpID</th>
                        <th>Date of Pay</th>
                        <th>Hourly Wage</th>
                        <th>Amount Paid</th>
                        <th>Hours worked</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.empId}</td>
                            <td>{item.date.toString()}</td>
                            <td>{item.hourly_wage}</td>
                            <td>{item.paid}</td>
                            <td>{item.work_hours}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default AdminCheckPayslip