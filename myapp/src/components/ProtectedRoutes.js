import React, {useState,useEffect} from "react"
import {BrowserRouter, Routes,Route, Navigate } from 'react-router-dom';
import { app } from '../firebaseConfig';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AdminDash from "./AdminDash";
import AdminProfile from "./AdminProfile";
import AdminStaffReg from "./AdminRegStaff";
import AdminViewLocation from "./AdminViewLocation";
import AdminViewPhoto from "./AdminViewPhoto";
import AdminViewStaff from "./AdminViewStaff";
import PasswordChange from "./PasswordChange";
import HrDash from "./HrDash";
import HrCheckSalary from "./HrCheckSalary";
import HrSetSalary from "./HrSetSalary";
import HrViewPhoto from "./HrViewPhoto";
import HrViewStaff from "./HrViewStaff";
import HrViewLocation from "./HrViewLocation"
import HrProfile from "./HrProfile"

const auth = getAuth(app);

function ProtectedRoutes() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  if (user) {
    return (
      <>
      <BrowserRouter>
      <Routes>
        <Route path="/admindash" element={<AdminDash />} />
        <Route path="/hrdash" element={<HrDash />} />
        <Route path="/admin_staff_reg" element={<AdminStaffReg />} />
        <Route path="/admin_view_employees" element={<AdminViewStaff />} />
        <Route path="/hr_view_employees" element={<HrViewStaff />} />
        <Route path="/admin_view_location" element={<AdminViewLocation />} />
        <Route path="/hr_view_location" element={<HrViewLocation />} />
        <Route path="/admin_view_photo" element={<AdminViewPhoto />} />
        <Route path="/hr_view_photo" element={<HrViewPhoto />} />
        <Route path="/hr_set_salary" element={<HrSetSalary />} />
        <Route path="/hr_check_salary" element={<HrCheckSalary />} />
        <Route path="/adminprofile" element={<AdminProfile />} />
        <Route path="/hrprofile" element={<HrProfile />} />
        <Route path="/passwordchange" element={<PasswordChange />} />
    </Routes>
    </BrowserRouter>
      </>
    );
  } else {
    return <Navigate to="/" />;
  }
}

export default ProtectedRoutes;