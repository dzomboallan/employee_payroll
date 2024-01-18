import {MapContainer,Popup,TileLayer,Marker} from 'react-leaflet'
import React, { useState } from 'react'
import { Link } from "react-router-dom"
import '../styles/topnav.css'
import '../styles/viewphoto.css'
import { app} from '../firebaseConfig'
import { getAuth, signOut } from 'firebase/auth'
import {getDatabase, ref, onValue,orderByChild,equalTo} from 'firebase/database'
import { getFirestore, getDocs, collection,query,where,Timestamp } from 'firebase/firestore'
import { OpenLocationCode } from 'open-location-code'

const rdB = getDatabase(app)
const auth = getAuth(app)
const db = getFirestore(app)
const olc = new OpenLocationCode()



function HrViewLocation(){
    const [userId, setUserId] = useState('')
    const [date, setDate] = useState('')
    const [locations,setLocations] = useState([])
    

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
                const newLocations = response.docs.map((doc)=>({
                    id: doc.id,
                    latlng: [doc.data().latitude,doc.data().longitude],
                    name: doc.data().empid
                }))
                setLocations(newLocations)
            }
        },function(error){
            console.error(error)
            alert("location query error", error)
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

            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
            integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI="
            crossOrigin=""/>
            <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
            integrity="sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM="
            crossOrigin=""></script>

                <form onSubmit={(e) => e.preventDefault()}>
                    
                    <label>
                        Employee ID:
                    </label>
                    <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
                    <br/>
                    <label>
                        Date:
                    </label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    <br/>
                    <button onClick={handleSearch}>Search</button>
                    
                </form>
            {locations.length> 0 && (
            <MapContainer center={[0, 0]} zoom={2} style={{ height: '500px' }}>
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {locations.map((location) => (
              <Marker key={location.id} position={location.latlng}>
                <Popup>{location.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
          )}
        </div>
    )


}
export default HrViewLocation

