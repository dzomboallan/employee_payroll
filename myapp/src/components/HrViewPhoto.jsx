import React,{useState} from "react"
import { Link,useNavigate } from "react-router-dom";
import '../styles/topnav.css'
import '../styles/viewphoto.css'
import { app} from '../firebaseConfig'
import { getAuth, signOut } from 'firebase/auth'
import { getFirestore, getDocs, collection,query,where,Timestamp } from 'firebase/firestore'

const auth = getAuth(app)
const db = getFirestore(app)



function HrViewPhoto(){
    const [userId, setUserId] = useState('');
    const [date, setDate] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const navigate = useNavigate()

    
    const handleSearch = async () => {
        const formattedDate = new Date(date).toISOString().slice(0, 10);
        
        const q = query(collection(db,'location_image_logs'),
                    where('empId','==',userId),
                    where('date','>=',new Date(formattedDate)),
                    where('date','<=',new Date(`${formattedDate}T23:59:59`)))

        const promise = getDocs(q)
        promise.then(function(response){
            if(response.docs.length == 0){
                alert('No data found')
            }else{
                const doc = response.docs[0]
                setPhotoUrl(doc.data().image_url)
            }
        },function(error){
            console.error(error)
            alert('error retrieving image')
        })
    }

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

            
                <form onSubmit={(e) => e.preventDefault()}>
                    
                    <label htmlFor="user-id-input">Employee ID:</label>
                    <input type="text" id="user-id-input" value={userId} onChange={(e) => setUserId(e.target.value)} />

                    <br/>
                
                    <label htmlFor="date-input">Date:</label>
                    <input type="date" id="date-input" value={date} onChange={(e) => setDate(e.target.value)} />
                    
                    <br/>

                    <button type='button' onClick={handleSearch}>Get login photo</button>
                </form>
            
            {photoUrl && (
                <div>
                    <img src={photoUrl} alt='Employee Photo'/>
                </div>
            )}
        </div>
    )

}
export default HrViewPhoto