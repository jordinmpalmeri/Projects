import "./TeacherViewSubmissions.css";
import Format from "./format";
import { useState, useEffect } from "react";

const getSubmissions = async (assignment, setSubmissions) => {
  try {
    const url = "http://127.0.0.1:8000/api/assignments/"+ assignment.id +"/submissions/"
    
    const response = await fetch(url);
    // console.log(response)

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    const submissions = await response.json();

    setSubmissions(submissions)
  } catch (error) {
    console.error("Error fetching classes:", error);
  }
};

const getGroups = async (assignment, setGroups) => {
  try {
    const url = "http://127.0.0.1:8000/api/assignments/"+ assignment.id +"/groups/"
    
    const response = await fetch(url);
    // console.log(response)

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    
    const groups = await response.json();

    setGroups(groups)
  } catch (error) {
    console.error("Error fetching classes:", error);
  }
};


// Function to determine submission status
const getSubmissionStatus = (submission) => {
  if (!submission.submitted_at) {
    return { status: "Not Submitted", statusClass: "status-not-submitted" };
  }
  return { status: "Submitted", statusClass: "status-submitted" };
};

const findGroupId = (groups, userId) => {
  for (const group of groups) {
    if (group.users.some(user => user.id === parseInt(userId))) {
      return group.id;
    }
  }
  return null;
};

const findUsername = (groups, userId) => {
  for (const group of groups) {
    const user = group.users.find(user => user.id === parseInt(userId));
    if (user) {
      return user.name;
    }
  }
  return null;
};


const listUsersWithoutSubmission = (groups, submissions) => {
  const submittedUserIds = new Set(submissions.map(sub => sub.user));

  const usersWithoutSubmission = [];

  groups.forEach(group => {
    group.users.forEach(user => {
      if (!submittedUserIds.has(user.id)) {
        usersWithoutSubmission.push({
          id: user.id,
          name: user.name,
        });
      }
    });
  });

  return usersWithoutSubmission;
}


function TeacherViewSubmissions({ setPage, assignment }) {
  const [submissions, setSubmissions] = useState([]);  
  const [groups, setGroups] = useState([]);  

  useEffect(() => {
    if (assignment?.id) {
      getSubmissions(assignment, setSubmissions)
      getGroups(assignment, setGroups)
    }
  }, [assignment.id]);  // Fixed: Include dependency to prevent unnecessary re-renders

  const leftContent = <>
  <div className="signout-button">
    <button onClick={() => setPage(2)}>Back</button>
  </div>
  </>;

  const rightContent = (
    <div className="mainview">
      <h1>Assignment Submissions</h1>{" "}
      {/**THIS NAME SHOULD ALSO BE PASSED IN FROM THE PREVIOUS PAGE */}
      <table className="SubmissionsTable">
        <thead>
          <tr>
            <th>Student</th>
            <th>Group number</th>
            <th>Status</th>
            <th>Submitted At</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => {
            const groupId = findGroupId(groups, submission.user)
            const username = findUsername(groups, submission.user)

            const { status, statusClass } = getSubmissionStatus(submission);

            const handleRowClick = () => {
              // Navigate to a different page when row is clicked
              // Here you can set the page to AssignmentDetails or wherever you want
              setPage(4); // Just an example, adjust this to your needs
            };

            return (
              <tr
                key={submission.id}
                onClick={handleRowClick} // Handle row click
                style={{ cursor: "pointer" }} // Make the row look like a clickable button
              >
                <td>{username ? username : "???"}</td>
                <td>{groupId ? groupId : "???"}</td>
                <td className={statusClass}>{status}</td>
                <td>
                  {submission.submitted_at
                    ? new Date(submission.submitted_at).toDateString()
                    : "N/A"}
                </td>
              </tr>
            );
          })}
          {listUsersWithoutSubmission(groups, submissions).map(user => (
          <tr
            key={user.id}
            style={{ cursor: "pointer" }}
          >
            <td>{user.name || "???"}</td>
            <td>{findGroupId(groups, user.id) || "???"}</td>
            <td className="status-not-submitted">Not Submitted</td>
            <td>N/A</td>
          </tr>
          ))}
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

export default TeacherViewSubmissions;