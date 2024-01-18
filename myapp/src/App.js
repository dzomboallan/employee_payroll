import logo from './logo.svg';
import './App.css';
import './index.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import HrLogin from './components/HrLogin';
import UserSignUp from './components/UserSignUp';
import AdminDash from './components/AdminDash';
import HrDash from './components/HrDash';
import AdminStaffReg from './components/AdminRegStaff';
//import HrStaffReg from './components/HrRegStaff';
import AdminViewStaff from './components/AdminViewStaff';
import HrViewStaff from './components/HrViewStaff';
import AdminViewLocation from './components/AdminViewLocation';
import HrViewLocation from './components/HrViewLocation';
import AdminViewPhoto from './components/AdminViewPhoto';
import HrViewPhoto from './components/HrViewPhoto';
//import HrSetSalary from './components/HrSetSalary';
import HrCheckSalary from './components/HrCheckSalary';
import AdminProfile from './components/AdminProfile';
import HrProfile from './components/HrProfile';
import PasswordChange from './components/PasswordChange';
import AdminSetSalary from './components/AdminSetSalary';
import AdminCheckSalary from './components/AdminCheckSalary';
import AdminCheckPayslip from './components/AdminCheckPayslip';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route exact path='/' element={<LandingPage/>}/>
      <Route path='/adminlogin' element={<AdminLogin/>}/>
      <Route path='/hrlogin' element={<HrLogin/>}/>
      <Route path='/usersignup' element={<UserSignUp/>}/>
      <Route path='/admindash' element={<AdminDash/>}/>
      <Route path='/hrdash' element={<HrDash/>}/>
      <Route path='/admin_staff_reg' element={<AdminStaffReg/>}/>
      {/*<Route path='/hr_staff_reg' element={<HrStaffReg/>}/>*/}
      <Route path='/admin_view_employees' element={<AdminViewStaff/>}/>
      <Route path='/hr_view_employees' element={<HrViewStaff/>}/>
      <Route path='/admin_view_location' element={<AdminViewLocation/>}/>
      <Route path='/hr_view_location' element={<HrViewLocation/>}/>
      <Route path='/admin_view_photo' element={<AdminViewPhoto/>}/>
      <Route path='/hr_view_photo' element={<HrViewPhoto/>}/>
      {/*<Route path='/hr_set_salary' element = {<HrSetSalary/>}/>*/}
      <Route path='/hr_check_salary' element={<HrCheckSalary/>}/>
      <Route path='/adminprofile' element={<AdminProfile/>}/>
      <Route path='/hrprofile' element={<HrProfile/>}/>
      <Route path='/passwordchange' element={<PasswordChange/>}/>
      <Route path='/admin_set_salary' element={<AdminSetSalary/>}/>
      <Route path='/admin_check_salary' element={<AdminCheckSalary/>}/>
      <Route path='/admin_check_payslips'element={<AdminCheckPayslip/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App;
