import { useState, useEffect } from "react";
import Format from "./format";
import "./CourseGrid.css";
import "./DeadlineList.css";

// Function to filter current courses
const getCurrentCourses = (courses) => {
  const today = new Date();
  return courses.filter((course) => {
    const start = new Date(course.start_date);
    const end = new Date(course.end_date);
    return today >= start && today <= end;
  });
};

// Function to filter past courses
const getPastCourses = (courses) => {
  const today = new Date();
  return courses.filter((course) => {
    const end = new Date(course.end_date);
    return today > end;
  });
};

function TeacherCoursesView({ setPage, currentUser, setCourse }) {
  const [courses, setCourses] = useState([]);
  const [currentCourses, setCurrentCourses] = useState([]);
  const [pastCourses, setPastCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock logged-in user email (replace this with actual auth logic)
  const loggedInEmail = "professor@union.edu"; // Change dynamically as needed

  // Fetch the professor's data and courses
  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        setLoading(true);
        // Fetch professors
        const professor = currentUser;

        // Fetch all courses
        const courseResponse = await fetch(
          "http://127.0.0.1:8000/api/classes/"
        );
        const allCourses = await courseResponse.json();

        // Filter courses for the logged-in professor
        const teacherCourses = allCourses.filter(
          (course) => course.teacher === professor.id
        );
        setCourses(teacherCourses);
        // console.log("HERE",teacherCourses)

        // Update current and past courses
        setCurrentCourses(getCurrentCourses(teacherCourses));
        setPastCourses(getPastCourses(teacherCourses));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherCourses();
  }, [loggedInEmail]); // Depend on the logged-in email to refetch on login change

  if (loading) {
    return <h2>Loading...</h2>;
  }

  const leftContent = (
    <div className="deadline-list">
      <h2> Upcoming Deadlines </h2>
      <button onClick={() => setPage(8)}> Create Course </button>
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
              onClick={() => {setPage(6); setCourse(course)}} // Navigate to TeacherAssignmentsView
            >
              <div className="course-code">{course.code}</div>
              <div className="course-title">{course.name}</div>
            </button>
          ))
        ) : (
          <p>No current courses available.</p>
        )}
      </div>

      <h2> Past Courses </h2>
      <div className="course-grid">
        {pastCourses.length > 0 ? (
          pastCourses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-code">{course.code}</div>
              <div className="course-title">{course.name}</div>
            </div>
          ))
        ) : (
          <p>No past courses available.</p>
        )}
      </div>
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

export default TeacherCoursesView;
