import { useState } from "react";
import "./App.css";
import AssignmentDetails from "./AssignmentDetails";
import AssignmentsView from "./AssignmentsView";
import CoursesView from "./CoursesView";
import CreateAssignment from "./CreateAssignment";
import CodeReview from "./CodeReview";
import LandingPage from "./LandingPage";
import TeacherViewSubmissions from "./TeacherViewSubmissions";
import CreateCourses from "./CreateCourses";

function App() {
  const [currentPage, setPage] = useState(0);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isTeacher, setTeacher] = useState(false);
  // const [submittedFiles, setSubmittedFiles] = useState([]);
  const [currentUser, setUser] = useState("");
  const [selectedCourse, setCourse] = useState(null);

  let pages = [
    <LandingPage
      setPage={setPage}
      setTeacher={setTeacher}
      isTeacher={isTeacher}
      setUser={setUser}
      currentUser={currentUser}
    />, // page 0
    <CoursesView
      isTeacher={isTeacher}
      setPage={setPage}
      currentUser={currentUser}
      setUser={setUser}
      setCourse={setCourse}
    />, // page 1
    <AssignmentsView
      currentUser={currentUser}
      setPage={setPage}
      setSelectedAssignment={setSelectedAssignment}
      isTeacher={isTeacher}
      selectedCourse={selectedCourse}
    />, // page 2
    <AssignmentDetails
      assignment={selectedAssignment}
      setPage={setPage}
      // submittedFiles={submittedFiles}
      // setSubmittedFiles={setSubmittedFiles}
      currentUser={currentUser}
      isTeacher={isTeacher}
    />, // page 3
    <CodeReview 
      setPage={setPage}
      isTeacher={isTeacher}
      assignment={selectedAssignment}
      currentUser={currentUser}
    />, // page 4
    <div></div>,
    <div></div>,
    <CreateAssignment
      setPage={setPage}
      selectedCourse={selectedCourse}
    />, // page 7
    <CreateCourses 
      setPage={setPage}
      currentUser={currentUser}
    />, // page 8
    <TeacherViewSubmissions
      setPage={setPage}
      assignment={selectedAssignment}
      currentUser={currentUser}
    />, // page 9
  ];

  console.log(selectedCourse)

  return (
    <div>
      {pages[currentPage] || <CoursesView />}{" "}
    </div>
  );
}

export default App;
