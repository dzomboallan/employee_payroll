import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import '../styles/topnav.css'
import '../styles/viewphoto.css'
import { app } from "../firebaseConfig"
import { getAuth,signOut } from "firebase/auth"
import { getFirestore,collection,addDoc, query, getDocs, where } from "firebase/firestore"

const dB = getFirestore(app)
const auth = getAuth(app)

function AdminSetSalary(){
    const [empID, setEmpID] = useState('')
    const [salary, setSalary] = useState(0)


    function handleLogout(){
        signOut(auth)
        if(signOut(auth)){
            alert("logged out")
        }else{
            console.error();
            alert('error logging out')
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const q = query(collection(dB,'employees'),where('EmpId','==',empID))
        const q1 = query(collection(dB,'employee_salary'),where('empId','==',empID))
        const promise = getDocs(q)
        promise.then(function(response){
            if(response.docs.length == 0){
                alert("employee doesnt exist")
                setEmpID("")
                setSalary(0)
            }else{
                const vow = getDocs(q1)
                vow.then(function(res){
                    if(res.docs.length > 0){
                        alert('record alredy exists')
                        setEmpID("")
                        setSalary(0)
                    }else{
                        const oath = addDoc(collection(dB,"employee_salary"),{
                            daySal: salary,
                            empId: empID
                        })
                        oath.then(function(answer){
                            console.log(answer)
                            alert("salary details added")
                            setEmpID("")
                            setSalary(0)
                        },function(error){
                            console.error(error)
                            alert('error adding salary')
                        })
                    }
                },function(error){
                    console.error(error)
                    alert('error checking salary details for redundancies')
                })
            }
        },function(error){
            console.error(error)
            alert('error checking employee data')
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

            
                <form onSubmit={handleSubmit} >
                    <h1>Set Employee Salary Form</h1>

                    
                    <label htmlFor="empID">Employee ID</label>
                    <input
                        type="text"
                        name="empID"
                        value={empID}
                        onChange={(e) => setEmpID(e.target.value)}
                        required/>
                    <br/>
                    
                    
                    
                    <label htmlFor="salary">Salary per hour</label>
                    <input
                        type="text"
                        name="slary"
                        value={salary}
                        onChange={(e) => setSalary(parseInt(e.target.value))}
                        required/>
                    <br/>
                    
                    <button type="submit">Submit</button>
                </form>
            

        </div>
    )
}
export default AdminSetSalary