import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/topnav.css'
import '../styles/staffdetails.css'
import { app } from "../firebaseConfig";
import { getFirestore,getDocs,query,collection } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

const db = getFirestore(app)
const auth = getAuth(app)

function HrViewStaff(){
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async() =>{
            const response = await getDocs(collection(db,"employees"))
            const values = response.docs.map((item) => ({
                id: item.id,
                Email: item.data().Email,
                EmpId: item.data().EmpId,
                Mobile: item.data().Mobile,
                Password: item.data().Password,
                Username: item.data().Password,
                date: item.data().date.toDate()
            }))
            setData(values)
        }
        fetchData()    
    },[])
    
    

    function handleLogout(){
        signOut(auth)
        if(signOut(auth)){
            alert("logged out")
        }else{
            console.error();
            alert('error logging out')
        }
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

            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th>EmpID</th>
                            <th>Date of Hire</th>
                            <th>Phone</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Password</th>
                        </tr>
                    </thead>

                    <tbody>
                        {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.EmpId}</td>
                            <td>{item.date.toString()}</td>
                            <td>{item.Mobile}</td>
                            <td>{item.Username}</td>
                            <td>{item.Email}</td>
                            <td>{item.Password}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default HrViewStaff