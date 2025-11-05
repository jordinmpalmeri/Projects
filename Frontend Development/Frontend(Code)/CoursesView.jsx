import { useState, useEffect } from "react";
import Format from "./format";
import "./CourseGrid.css";
import "./DeadlineList.css";

const getClasses = async (isTeacher, userId, setCurrentCourses, setPastCourses) => {
  try {
    let url = ""
    if (isTeacher) {
      url = "http://127.0.0.1:8000/api/classes/?teacher=" + userId;
    } else {
      url = "http://127.0.0.1:8000/api/classes/?student=" + userId;
    }
    const response = await fetch(url);
    // console.log(response)

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const courses = await response.json();

    // console.log("Checking courses: ", courses);

    // Filter courses into current and past (no future course appear on the page)
    const today = new Date();
    const currentCourses = courses.filter(course => {
      const start = new Date(course.start_date);
      const end = new Date(course.end_date);
      return today >= start && today <= end;
    });

    const pastCourses = courses.filter(course => {
      const end = new Date(course.end_date);
      return today > end;
    });

    // Update state
    setCurrentCourses(currentCourses);
    setPastCourses(pastCourses);
  } catch (error) {
    console.error("Error fetching classes:", error);
  }
};


const getAssignments = async (userId, setDeadlines) => {
  try {
    const url = "http://127.0.0.1:8000/api/classes/user_assignments/?user_id=" + userId;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const assignments = await response.json();

    // Filter assignments by the date
    const today = new Date();
    const deadlines = assignments.flatMap(a => [
      {
        id: `${a.id}`,
        assignment: a.name,
        course: a.course_code,
        type: 'submission due',
        due: new Date(a.submission_deadline)
      },
      {
        id: `${a.id}`,
        assignment: a.name,
        course: a.course_code,
        type: 'comment due',
        due: new Date(a.commenting_deadline)
      }
    ]).filter(d => d.due > today)
      .sort((a, b) => a.due - b.due);

    setDeadlines(deadlines);
  } catch (error) {
    console.error("Error fetching classes:", error);
  }
};


function CoursesView({ isTeacher, setPage, currentUser, setUser, setCourse }) {
  const [currentCourses, setCurrentCourses] = useState([]);  // Fixed: Initialize as an array
  const [pastCourses, setPastCourses] = useState([]);        // Fixed: Initialize as an array
  const [deadlines, setDeadlines] = useState([]);  

  useEffect(() => {
    if (currentUser?.id) {
      getClasses(isTeacher, currentUser.id, setCurrentCourses, setPastCourses);
      getAssignments(currentUser.id, setDeadlines);
    }
  }, [currentUser.id]);  // Fixed: Include dependency to prevent unnecessary re-renders

  const leftContent = (
    <div className="deadline-list">
      {!isTeacher && <h2> Upcoming Deadlines </h2>}
      {!isTeacher && deadlines.map((deadline) => (
        <div key={deadline.id} className="deadline-item">
          <h3>{deadline.course} - {deadline.assignment}</h3>
          <p>
            <strong>Type:</strong> {deadline.type}
          </p>
          <p>
            <strong>Due:</strong> <em>
              {deadline.due.toLocaleDateString('en-US')}
            </em>
          </p>
        </div>
      ))}
      {isTeacher && <button onClick={() => setPage(8)}> Create Course </button>}
      <div className="signout-button">
        <button onClick={() => { setPage(0); setUser(""); }}>Sign Out</button>
      </div>
    </div>
  );

  const rightContent = (
    <div>
      <h1> Your Courses </h1>

      <h2> Current Courses </h2>
      <div className="course-grid">
        {currentCourses.length > 0 ? (
          currentCourses.map((course) => (
            <button
              key={course.id}
              className="course-card"
              onClick={() => {setPage(2); setCourse(course)}} // Navigate to AssignmentsView
            >
              <div className="course-code">{course.code}</div>
              <div className="course-title">{course.name} | {course.term}</div>
            </button>
          ))
        ) : (
          <p>No current courses</p>
        )}
      </div>

      <h2> Past Courses </h2>
      <div className="course-grid">
        {pastCourses.length > 0 ? (
          pastCourses.map((course) => (
            <button
              key={course.id}
              className="course-card"
              onClick={() => {setPage(2); setCourse(course)}} // Navigate to AssignmentsView
            >
              <div className="course-code">{course.code}</div>
              <div className="course-title">{course.name} | {course.term}</div>
            </button>
          ))
        ) : (
          <p>No past courses</p>
        )}
      </div>
    </div>
  );

  return <Format leftContent={leftContent} rightContent={rightContent} setPage={setPage} />;
}

export default CoursesView;
