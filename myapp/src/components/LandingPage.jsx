import React from "react"
import '../styles/landingstyle.css'

const LandingPage = () => {
    return(
        <>
        <nav>
          <div className="logo">
            <a href="#">EMS</a>
          </div>
          <ul className="nav-links">
            <li><a href="adminlogin">Admin Login</a></li>
            <li><a href="hrlogin">HR Login</a></li>
            <li><a href="usersignup">User Sign Up</a></li>
          </ul>
          <div className="burger">
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
          </div>
        </nav>
        <main>
          <section className="showcase">
            <div className="slideshow-container">
              <div className="mySlides fade">
                <img src="../images/HR.jpg" style={{width: '100%'}} alt="slide 1" />
              </div>
              <div className="mySlides fade">
                <img src="../images/Employee.jpg" style={{width: '100%'}} alt="slide 2" />
              </div>
              <div className="mySlides fade">
                <img src="../images/Admin.jpg" style={{width: '100%'}} alt="slide 3" />
              </div>
            </div>
          </section>
          <section className="info">
            <h1>Employee Management System</h1>
            <p>Track your employees and manage their payrolls with ease.</p>
          </section>
        </main>
        <script src="./slideshow.js"></script>
      </>
    )
}
export default LandingPage
