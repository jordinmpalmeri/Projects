import { useEffect, useState } from "react";
import Format from "./format";
import "./AssignmentsView.css";

const getInstructor = async (courseID, setInstructor) => {
  try {
    const url = "http://127.0.0.1:8000/api/classes/get-instructor/?course_id=" + courseID;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const teacher = await response.json();

    setInstructor(teacher);
  } catch (error) {
    console.error("Error fetching assignments:", error);
  }
};

const getAssignments = async (isTeacher, userid, courseID, setAssignments) => {
  if (isTeacher) {
    try {
      const url = "http://127.0.0.1:8000/api/classes/" + courseID + "/assignments/";
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
  
      const assignments = await response.json();
    
      setAssignments(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  } else {
    try {
      const url = "http://127.0.0.1:8000/api/classes/student-assignments/?student_id="+ userid +"&class_id="+ courseID;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const assignments = await response.json();

      setAssignments(assignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  }
};

const getAssignmentStatus = async (assignment, currentUser, isTeacher) => {
  const currentDate = new Date();

  if (currentDate < new Date(assignment.release_date)) {
    return { status: "Not Released", statusClass: "status-not-released" };
  }

  if (! isTeacher) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/assignments/${assignment.id}/submissions/?student=${currentUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch submission status');
      }
      const submissions = await response.json();

      if (currentDate < new Date(assignment.submission_deadline) && submissions.length === 0) {
        return { status: "Not Submitted", statusClass: "status-not-turned-in" };
      }

      if (currentDate < new Date(assignment.submission_deadline) && submissions.length > 0) {
        return { status: "Submitted. Do review", statusClass: "status-submitted" };
      }

      if (currentDate < new Date(assignment.commenting_deadline)) {
        return { status: "Review", statusClass: "status-review" };
      }

      return { status: "Finished", statusClass: "status-finished" };
    } catch (error) {
      console.error('Error fetching submission status:', error);
      return { status: "Error", statusClass: "status-error" };
    }
  } else {
    if (currentDate < new Date(assignment.submission_deadline)) {
      return { status: "Before submission deadline", statusClass: "status-not-turned-in" };
    }

    if (currentDate < new Date(assignment.commenting_deadline)) {
      return { status: "Review", statusClass: "status-review" };
    }

    return { status: "Finished", statusClass: "status-finished" };
  }
};


function AssignmentsView({ isTeacher, setPage, setSelectedAssignment, selectedCourse, currentUser}) {
  const [assignments, setAssignments] = useState([]);
  const [instructor, setInstructor] = useState("") 
  const [assignmentStatuses, setAssignmentStatuses] = useState({});

  // Fetch assignments on component mount
  useEffect(() => {
    getAssignments(isTeacher, currentUser.id, selectedCourse.id, setAssignments);
    getInstructor(selectedCourse.id, setInstructor)
  }, [selectedCourse.id]);

  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses = {};
      for (const assignment of assignments) {
        const status = await getAssignmentStatus(assignment, currentUser, isTeacher);
        statuses[assignment.id] = status;
      }
      setAssignmentStatuses(statuses);
    };
    fetchStatuses();
  }, [assignments, currentUser, isTeacher]);

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment); // Update selected assignment
    const status = assignmentStatuses[assignment.id]?.status;
    if (isTeacher) {
      setPage(9); // Navigate to the selected assignment page
    } else if (status === "Not Submitted" || status === "Before submittion deadline" ) {
      setPage(3);
    } else {
      setPage(4);
    }
  };

  if (!selectedCourse) {
    return <h2>Please select a course to view assignments.</h2>;
  }

  const leftContent = (
    <>
    <div className="card">
      <h3>Instructor</h3>
      <p>{instructor.name}</p>
    </div>
    {isTeacher &&
      <button className="card" onClick={() => setPage(7)}>Create Assignment</button>
    }
    <div className="signout-button">
      <button onClick={() => setPage(1)}>Back</button>
    </div>
    </>
  );

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
              const { status, statusClass } = assignmentStatuses[assignment.id] || {};
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

  return (
    <Format
      leftContent={leftContent}
      rightContent={rightContent}
      setPage={setPage}
    />
  );
}

export default AssignmentsView;
