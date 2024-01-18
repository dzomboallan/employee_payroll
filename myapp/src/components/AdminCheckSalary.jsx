import React, {useState} from "react"
import { Link } from "react-router-dom"
import '../styles/topnav.css'
import '../styles/viewphoto.css'
import { getAuth,signOut, onAuthStateChanged } from "firebase/auth"
import { getFirestore, collection, query, getDocs, where,updateDoc, Timestamp, doc,addDoc } from "firebase/firestore"
import { app } from "../firebaseConfig"

const auth = getAuth(app)
const db = getFirestore(app)


function AdminCheckSalary () {
    const [empID, setEmpID] = useState('')
    const [dailySalary, setDailySalary] = useState(0)
    const [dailyPay, setDailyPay] = useState(0)
    const [workHours, setWorkHours] = useState(0)
    const {date,setdate} = useState('')

    function handleLogout() {
        signOut(auth)
        if(signOut(auth)){
            alert("logged out")
        }else{
            console.error();
            alert('error logging out')
        }
    }

    const handleGeneratePayslipClick = async(event) =>{
        event.preventDefault()
        const q = query(collection(db,'employee_salary'),where('empId','==',empID))
        const promise = getDocs(q)
        promise.then(function(response){
            
            if(response.docs.length>0){
                const docs = response.docs[0]
                const data = docs.data()
                const daily_salary = data.daySal
                console.log(daily_salary)
                setDailySalary(daily_salary)
                const q1 = query(collection(db,'employees'),where('EmpId','==',empID))
                const vow = getDocs(q1)
                vow.then(function(answer){
                    
                    if(answer.docs.length>0){
                        const docs1 = answer.docs[0]
                        const data1 = docs1.data()
                        const loginTime = data1.lastLogin.toMillis()
                        console.log(loginTime)
                        const logoutTime = data1.lastLogout.toMillis()
                        console.log(logoutTime)
                        const loggedInTime = logoutTime - loginTime
                        const loggedInHours = Math.round(loggedInTime/(1000 * 60 * 60))
                        console.log(loggedInHours)
                        const dayPay = loggedInHours * daily_salary
                        console.log(dayPay)
                        setWorkHours(loggedInHours)
                        setDailyPay(dayPay)
                        const prom = addDoc(collection(db,"payslips"),{
                            date: Timestamp.now().toDate(),
                            empId: empID,
                            hourly_wage: daily_salary,
                            paid: dayPay,
                            work_hours: loggedInHours
                        })
                        prom.then(function(response){
                            console.log(response)
                        },function(error){
                            console.error(error)
                        })
                    }else{
                        alert("record not found")
                    }
                },function(error){
                    console.error(error)
                })
            }else{
                alert("employee doesn't exist")
            }
            
            
        },function(error){
            console.error(error)
        })

        

    }

   

    

    return (
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
            
                <form onSubmit={handleGeneratePayslipClick}>
                    <h1>Check Employee salary</h1>

                    
                    <label htmlFor="empID">Employee ID</label>
                    <input
                        type="text"
                        name="empID"
                        value={empID}
                        onChange={(e) => setEmpID(e.target.value)}
                        required/>
                    <br/>
                    
                    <br />
                    <button type="submit">Generate Payslip</button>
                </form>
            
            {dailyPay > 0 && (
            <div>
                <p>
                    Employee ID: <strong>{empID}</strong>
                </p>
                <p>
                    Hourly Salary: <strong>Ksh.{dailySalary}</strong>
                </p>
                <p>
                    Work Hours: <strong>{workHours}</strong>
                </p>
                <p>
                    Total Pay: <strong>Ksh.{dailyPay}</strong>
                </p>
            </div>
        )}

        </div>
    )
}
export default AdminCheckSalary