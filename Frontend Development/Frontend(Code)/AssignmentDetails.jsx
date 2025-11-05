import { useState, useEffect } from "react";
import "./AssignmentDetails.css";
import "./App.css";
import Format from "./format";


const getGroups = async (assignmentID, userid, setGroups) => {
  try {
    const url = "http://127.0.0.1:8000/api/assignments/"+ assignmentID +"/groups/";
    const response = await fetch(url);

    console.log(url)


    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const groups = await response.json();

    const userGroup = groups.find(group => group.users.some(user => user.id === userid));

    if (userGroup) {
      const otherMembers = userGroup.users.filter(user => user.id !== userid);
      setGroups(otherMembers);
    } else {
      setGroups(["This is an individual assignment"]);
    }
  } catch (error) {
    console.error("Error fetching assignments:", error);
  }
};


function AssignmentDetails({ currentUser, assignment, setPage, isTeacher }) {
  const [submittedFiles, setSubmittedFiles] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState([]);
  const [groups, setGroups] = useState([])
  
  if (!assignment) {
    return <div>GO TO PAGE 3 AND SELECT AN ASSIGNMENT</div>;
  }


  useEffect(() => {
    getGroups(assignment.id, currentUser.id, setGroups)
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Format to "MM/DD/YYYY" by default
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);

    // Read files and process their content
    const filePromises = files.map((file) => readFileAsText(file));

    // Wait for all files to be read and update the state
    Promise.all(filePromises).then((fileContents) => {
      const newFiles = files.map((file, index) => ({
        name: file.name,  // Store the file name
        content: fileContents[index],  // Store the file content (read as text)
      }));

      // Update the state by adding new files to the existing ones
      setSubmittedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    });
  };

  // Function to read a file as text
  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result); // Resolve with file content
      reader.onerror = reject; // Reject if there's an error
      reader.readAsText(file); // Start reading the file as text
    });
  };

  const handleSubmission = async (e) => {
    e.preventDefault();
  
    const submissionData = {
      submission: {
        assignment: assignment.id,
        user: currentUser.id,
        is_current: true,
        submitter_has_reviewed_comments: false,
        submitted_at: new Date().toISOString()
      },
      files: submittedFiles.map(file => ({
        name: file.name,
        content: file.content
      }))
    };
  
    try {
      const response = await fetch('http://127.0.0.1:8000/api/submit/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
  
      const responseText = await response.text();
      console.log('Server response:', responseText);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = JSON.parse(responseText);
      console.log('Submission successful:', result);
      setSubmissionStatus('Success');
      alert('Submission successfully added');
      setPage(2)
    } catch (error) {
      console.error('Error adding submission:', error);
      setSubmissionStatus('Error');
      alert(`Failed to add submission: ${error.message}`);
    }
  };
  
  // Render content of the submitted files (readable format)
  const renderSubmittedFiles = submittedFiles.map((file, index) => (
    <li key={index}>{file.name}</li>  // Display the file name only
  ));

  const leftContent = (
    <>  
      <div className="card">
        <h3>Groups</h3>
        {groups.map(member => (
          <p key={member.id}>{member.name}</p>
        ))}
      </div>
      <button onClick= {() => setPage(2)} className = "button-different-assignment">
        {" "}
        Choose Different Assignment{" "}
      </button> 
  </>
    
  );

  const rightContent = (
    <div>
      {!isTeacher && <div>
      <h1>{assignment.name}</h1>
      <div className="segments">
        <div className="main-content">
          <h3>Project Description:</h3>
          <p>{assignment.description}</p>

          <h3>Deadlines:</h3>
          <ul>
            <li>Code Due: {formatDate(assignment.submission_deadline)}</li>
            <li>Review Due: {formatDate(assignment.commenting_deadline)}</li>
          </ul>
        </div>

        <div className="submissions">
          <h3>Submissions</h3>
          {submittedFiles.length > 0 ? (
            <ul>{renderSubmittedFiles}</ul>
          ) : (
            <p>No Submissions yet</p>
          )}

          <input
            type="file"
            id="fileInput"
            multiple
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
          <button
            className="button-submission"
            onClick={() => document.getElementById("fileInput").click()}
          >
            Select Files
          </button>
          <button
            className="button-submission"
            onClick={handleSubmission}
            disabled={submittedFiles.length === 0}
          >
            Submit Files
          </button>
          {submissionStatus && (
            <p>{submissionStatus === 'Success' ? 'Submission successful!' : 'Submission failed. Please try again.'}</p>
          )}
        </div>
      </div>
      </div>}
    </div>
  );

  return <Format leftContent={leftContent} rightContent={rightContent} setPage={setPage} />;
}

export default AssignmentDetails;
