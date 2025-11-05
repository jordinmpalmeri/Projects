import { useState, useEffect } from "react";
import "./LandingPage.css";
import logo from "./assets/gitgoodlogo.png";

// Function to fetch user from either the student or professor endpoint
const getUserRole = async (email, setUser, setTeacher) => {
  // Check student API
  const studentUrl = `http://127.0.0.1:8000/api/students/`;
  const profUrl = `http://127.0.0.1:8000/api/profs/`;

  // First, try to fetch from the students endpoint
  const studentResponse = await fetch(studentUrl);
  const students = await studentResponse.json();
  
  // Check if the email exists in students data
  const student = students.find((user) => user.email === email);
  
  if (student) {
    setUser(student); // Set the user as a student
    setTeacher(false); // Set teacher state to false
    return; // Exit the function as we've found the user
  }

  // If not found in students, check the professors endpoint
  const profResponse = await fetch(profUrl);
  const professors = await profResponse.json();

  // Find professor in the data
  const professor = professors.find((user) => user.email === email);
  
  if (professor) {
    setUser(professor); // Set the user as a professor
    setTeacher(true); // Set teacher state to true
  } else {
    // Handle case where the email is not found in either students or professors
    setUser(null);
    setTeacher(false);
  }
};

function LandingPage({ setPage, setTeacher, isTeacher, setUser, currentUser }) {
  const [email, setEmail] = useState(""); // Start with empty email
  const [password, setPassword] = useState(""); // Password is set but not used here
  const [error, setError] = useState("");

  // Use useEffect to call getUserRole when the email is set
  useEffect(() => {
    if (email) {
      getUserRole(email, setUser, setTeacher); // Fetch role when email changes
    }
  }, [email, setUser, setTeacher]); // Dependencies ensure this runs when email changes

  // Handle sign-in
  const handleSignIn = () => {
    if (email) {
      setError(""); // Clear previous error messages
      // console.log(currentUser)
      // console.log("Teacher?", isTeacher)
      if (!currentUser){
        setPage(0);
        setError("Invalid email or password.");
      }
      if (currentUser) {
        setPage(1); // Redirect to page 1
      }
    }

    if (!email) {
      setError("Please enter an email.");
      return;
    }
  };

  return (
    <div className="sign-in-stuff">
      <img className="logo-landingPage" src={logo} alt="Git Good logo" />
      <p>
        This tool is made for students taking introductory Comp Sci classes at
        Union College. It allows students to upload code for peer reviewing.
        Made by Team Git Good for CSC260.
      </p>

      {/** Email Textbox */}
      <div className="textbox">
        <p>ID: </p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update email state
        />
      </div>

      {/** Password Textbox */}
      <div className="textbox">
        <p>Password: </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // Update password state
        />
      </div>

      {/** Display error message if login fails */}
      {error && <p className="error-message">{error}</p>}

      <button className="sign-in-button" onClick={handleSignIn}>
        SIGN IN
      </button>
    </div>
  );
}

export default LandingPage;
