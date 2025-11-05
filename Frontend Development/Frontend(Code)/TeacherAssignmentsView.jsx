import "./AssignmentsView.css";
import Format from "./format";
import { useEffect, useState } from "react";

const getAssignments = async (courseID, setAssignments) => {
  try {
    const url = "http://127.0.0.1:8000/api/assignments/";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const assignments = await response.json();

    // Filter assignments for the selected course
    const currentAssignments = assignments.filter(assignment => assignment.course === courseID);

    setAssignments(currentAssignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
  }
};

// Function to determine assignment status
const getAssignmentStatus = (assignment) => {
  const currentDate = new Date();
  if (currentDate < new Date(assignment.release_date)) {
    return { status: "Not Released", statusClass: "status-not-released" };
  }
  if (currentDate < new Date(assignment.submission_deadline)) {
    return { status: "Not Submitted", statusClass: "status-not-turned-in" };
  }
  if (currentDate < new Date(assignment.commenting_deadline)) {
    return { status: "Review", statusClass: "status-review" };
  }
  return { status: "Finished", statusClass: "status-finished" };
};

// **** ASSIGNMENTS VIEW COMPONENT ****
function TeacherAssignmentsView({ setPage, setSelectedAssignment, selectedCourse, currentUser }) {
  const [assignments, setAssignments] = useState([]);

  useEffect(() => {
    if (selectedCourse) {
      getAssignments(selectedCourse.id, setAssignments);
    }
  }, [selectedCourse]);

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
    setPage(9); // Navigate to the selected assignment page
  };

  if (!selectedCourse) {
    return <h2>Please select a course to view assignments.</h2>;
  }

  // **** LEFT CONTENT ****
  const leftContent = (
    <>
      <div className="card">
        <h3>Instructor</h3>
        <p>{currentUser.name}</p>
      </div>
      <div className="card">
        <button onClick={() => setPage(7)}>Create Assignment</button>
      </div>
      <div className="signout-button">
        <button onClick={() => setPage(5)}>Back</button>
      </div>
    </>
  );

  // **** RIGHT CONTENT ****
  const rightContent = (
    <div className="mainview">
      <h1>{selectedCourse.code}: {selectedCourse.name}</h1>
      <table className="AssignmentsTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Code Due</th>
            <th>Review Due</th>
          </tr>
        </thead>
        <tbody>
          {assignments.length > 0 ? (
            assignments.map((assignment) => {
              const { status, statusClass } = getAssignmentStatus(assignment);
              return (
                <tr key={assignment.id} onClick={() => handleAssignmentClick(assignment)}>
                  <td>{assignment.name}</td>
                  <td className={statusClass}>{status}</td>
                  <td>{new Date(assignment.submission_deadline).toDateString()}</td>
                  <td>{new Date(assignment.commenting_deadline).toDateString()}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4">No assignments available for this course.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return <Format leftContent={leftContent} rightContent={rightContent} setPage={setPage} />;
}

export default TeacherAssignmentsView;
