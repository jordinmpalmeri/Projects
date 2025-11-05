import { useState, useEffect } from "react";
import "./App.css"
import "./CreateAssignment.css"
import Format from "./format"

function CreateCourses({currentUser, setPage}) {
    // state variables
    const [code, setCode] = useState('');
    const [name, setName] = useState('');
    const [term, setTerm] = useState('');
    const [start_date, setStartDate] = useState('');
    const [end_date, setEndDate] = useState('');

    // THIS HANDLES POSTS
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      const classData = {
        code,
        name,
        term,
        start_date,
        end_date,
        teacher: currentUser.id
      };
    
      try {
        const response = await fetch('http://127.0.0.1:8000/api/classes/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(classData),
        });
    
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
        }
    
        const result = await response.json();
        console.log('Class added:', result);
    
        setCode('');
        setName('');
        setTerm('');
        setStartDate('');
        setEndDate('');
    
        alert('Class successfully added'); //notification
    
      } catch (error) {
        console.error('Error adding class:', error);
        alert(`Failed to add class: ${error.message}`);
      }
    };
    


    {/* Function that takes you back to main page */}
    function goBack(){
        setPage(1)
    }

    const leftContent = <></>;
  
    const rightContent = (
      <div className="mainview">
        <h1> Create Course </h1>
        <div className="segments">
          <div className="project-info">
            <div className="project-description">
              <form>
                <h3>Course Code</h3>
                <input type="text" id="CourseName" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Class Code" required />
                <h3>Course Name</h3>
                <input type="text" id="CourseName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Class Name" required />
                <h3>Course Term</h3>
                <input type="text" id="CourseName" value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Term"required />
                <h3>Start Date</h3>
                <input type="date" id="CourseName" value={start_date} onChange={(e) => setStartDate(e.target.value)} placeholder="Start Date" required />
                <h3>End Date</h3>
                <input type="date" id="CourseName" value={end_date} onChange={(e) => setEndDate(e.target.value)} placeholder="End Date" required />
              </form>
            </div>
          </div>
            
            {/* Button that takes you back to main */}
          <div className="right-panel">
            <button onClick={goBack} className = "button-cancel">
              {" "}
              Cancel{" "}
            </button>
  
            {/* Publish assignment Button*/}
            <button onClick={handleSubmit} className="button-publish-assignment">
              {" "}
              Publish Assignment{" "}
            </button>
          </div>
        </div>
      </div>
    );
  
    const left = leftContent;
    const right = rightContent;
  
    return <Format leftContent={left} rightContent={right} setPage={setPage} />;
  }
    
    
    export default CreateCourses;