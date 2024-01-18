import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../styles/topnav.css'
import '../styles/staffdetails.css'
import { app } from "../firebaseConfig";
import { getFirestore,getDocs,query,collection, deleteDoc,doc,where } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

const db = getFirestore(app)
const auth = getAuth(app)

function AdminViewStaff(){
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
    
    

    const handleDelete = async (id) => {
        try{
            //delete from database
            await deleteDoc(doc(db,"employees",id))
            //delete from table
            setData(data.filter((item)=> item.id !== id))
            alert("record deleted")
        }
        catch(error){
            console.log(error)
            alert(error)
        }
    }

    function handleLogout(){
        signOut(auth)
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
                        <th>Action</th>
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
                            <td>
                            <button onClick={() => handleDelete(item.id)}>
                                Delete
                            </button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default AdminViewStaff