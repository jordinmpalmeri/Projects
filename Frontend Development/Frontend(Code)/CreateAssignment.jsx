import { useState, useEffect } from "react";
import "./App.css";
import "./CreateAssignment.css";
import Format from "./format";

const getStudents = async (courseID, setStudents) => {
  try {
    const url = "http://127.0.0.1:8000/api/students/?class=" + courseID;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const students = await response.json();

    setStudents(students);

    console.log(students)
  } catch (error) {
    console.error("Error fetching classes:", error);
  }
};

function CreateAssignment({ selectedCourse, setPage }) {
  const [groupSize, setGroupSize] = useState("4");
  const [students, setStudents] = useState([]);
  const [groups, setGroups] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submissionDeadline, setSubmissionDeadline] = useState("");
  const [commentingDeadline, setCommentingDeadline] = useState("");
  const [releaseDate, setReleaseDate] = useState("");

  const randomizeGroups = () => {
    let shuffled = [...students].sort(() => Math.random() - 0.5);
    let newGroups = [];

    while (shuffled.length) {
      newGroups.push(shuffled.splice(0, groupSize));
    }

    setGroups(newGroups);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const assignmentData = {
      assignment: {
        name,
        description,
        submission_deadline: submissionDeadline,
        course: selectedCourse.id,
        commenting_deadline: commentingDeadline,
        release_date: releaseDate,
      },
      groups: groups.map((group, index) => ({
        name: `Group ${index + 1}`,
        members: group.map(student => student.id),
      })),
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/assignments/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assignmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Assignment and groups added:', result);
      alert('Assignment and groups successfully added');
      setPage(2);
    } catch (error) {
      console.error('Error adding assignment and groups:', error);
      alert(`Failed to add assignment and groups: ${error.message}`);
    }
  };

  useEffect(() => {
    getStudents(selectedCourse.id, setStudents);
  }, [selectedCourse.id]);

  useEffect(() => {
    if (students.length > 0) {
      randomizeGroups();
    }
  }, [students, groupSize]);

  function goBack() {
    setPage(2);
  }


  const leftContent = <></>;

  const rightContent = (
    <div className="mainview">
      <h1>Create Assignment</h1>
      <div className="segments">
        <div className="project-info">
          <div className="project-description">
            <form>
              <h3>Assignment Name</h3>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Assignment Name" required />
              <h3>Assignment Description</h3>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Assignment Description" required />
              <h3>Submission Deadline</h3>
              <input type="date" value={submissionDeadline} onChange={(e) => setSubmissionDeadline(e.target.value)} required />
              <h3>Commenting Deadline</h3>
              <input type="date" value={commentingDeadline} onChange={(e) => setCommentingDeadline(e.target.value)} required />
              <h3>Release Date</h3>
              <input type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} required />
              <h3>Group Size</h3>
              <input type="number" value={groupSize} onChange={(e) => setGroupSize(parseInt(e.target.value))} min="2" required />
            </form>
          </div>
          <div className="group-box">
            {groups.map((group, index) => (
              <div className="group" key={index}>
                <h3>Group {index + 1}</h3>
                {group.map((student, i) => (
                  <p key={i}>{student.name}</p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="right-panel">
          <button onClick={goBack} className="button-cancel">
            Cancel
          </button>
          <button onClick={randomizeGroups} className="button-randomize-groups">
            Randomize Groups
          </button>
          <button onClick={handleSubmit} className="button-publish-assignment">
            Publish Assignment
          </button>
        </div>
      </div>
    </div>
  );

  const left = leftContent;
  const right = rightContent;

  return <Format leftContent={left} rightContent={right} setPage={setPage} />;
}

export default CreateAssignment;
