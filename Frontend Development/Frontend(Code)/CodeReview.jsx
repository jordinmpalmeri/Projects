import Format from "./format";
import React, { useState, useEffect } from "react";
import "./CodeReview.css";

const getSubmissions = async (assignmentID, setSubmissions) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/submit/");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const allSubmissions = await response.json();
    const filteredSubmissions = allSubmissions.filter(sub => sub.assignment === assignmentID);
    setSubmissions(filteredSubmissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
  }
};

const getGroup = async (assignmentID, currentUserID, setGroup) => {
  try {
    const url = `http://127.0.0.1:8000/api/assignments/${assignmentID}/groups/`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const groups = await response.json();
    const userGroup = groups.find(group => group.users.some(user => user.id === currentUserID));
    setGroup(userGroup);
  } catch (error) {
    console.error("Error fetching groups:", error);
  }
};

function CodeReview({ isTeacher, assignment, currentUser, setPage }) {
  const [selectedGroup, setGroup] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [selectedSubmissionID, setSelectedSubmissionID] = useState(null);
  const [submittedFiles, setSubmittedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileComments, setFileComments] = useState({});
  const [lineNumbers, setLineNumbers] = useState({});
  const [fileCommentsList, setFileCommentsList] = useState([]);

  useEffect(() => {
    if (assignment && currentUser) {
      getGroup(assignment.id, currentUser.id, setGroup);
      getSubmissions(assignment.id, setSubmissions);
    }
  }, [assignment, currentUser]);

  const getCommentsForFile = async (fileID) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/addcomment/");
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const allComments = await response.json();
      const filteredComments = allComments.filter(comment => comment.submission_file === fileID);
      setFileCommentsList(filteredComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file before submitting a comment.");
      return;
    }

    const commentData = {
      submission: selectedSubmissionID,
      submission_file: selectedFile.id,
      line_number: parseInt(lineNumbers[selectedFile.id]) || 1,
      user: currentUser.id,
      comment: fileComments[selectedFile.id] || "",
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/addcomment/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentData),
      });

      const responseText = await response.text();
      console.log("Server response:", responseText);
      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const result = JSON.parse(responseText);
      console.log("Comment Successful:", result);

      alert("Comment Successfully Added");
      getCommentsForFile(selectedFile.id);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const showCorrectFiles = (userID) => {
    setSelectedUserID(userID);
    const userSubmission = submissions.find(sub => sub.user === userID && sub.is_current);
    if (userSubmission) {
      setSelectedSubmissionID(userSubmission.id);
      setSubmittedFiles(userSubmission.files);
      setSelectedFile(null);
      setFileCommentsList([]);
    } else {
      setSelectedSubmissionID(null);
      setSubmittedFiles([]);
      setSelectedFile(null);
      setFileCommentsList([]);
    }
  };

  const handleFileSelection = (file) => {
    setSelectedFile(file);
    setFileCommentsList([]);
    getCommentsForFile(file.id);
  };

  return (
    <Format
      leftContent={
        <>
          <button onClick={() => setPage(0)}>Log Out</button>

          <div className="card">
            <h3>Group Members:</h3>
            {selectedGroup?.users?.map(user => (
              <div key={user.id} onClick={() => showCorrectFiles(user.id)} className="group-member">
                {user.name}
              </div>
            )) || <p>Loading group members...</p>}
          </div>

          {submittedFiles.length > 0 && (
            <div className="card">
              <h3>Files:</h3>
              {submittedFiles.map(file => (
                <div key={file.id} onClick={() => handleFileSelection(file)} className="file-item">
                  {file.name}
                </div>
              ))}
            </div>
          )}
          <button onClick={() => setPage(2)} className="button-different-assignment">
            Choose Different Assignment
          </button>
        </>
      }
      rightContent={
        <div className="mainview">
          <div className="code-and-comments">
            <div className="code-section">
              {selectedFile ? (
                <>
                  <h2 className="codeBox-Title">{selectedFile.name}</h2>
                  <pre className="codeBox-contents">
                    <code>
                      {selectedFile.content
                        ?.replace(/^b'|\\n'$/g, "")
                        .split("\\n")
                        .map((line, index) => (
                          <div key={index} className="code-line">
                            <span className="line-number">{index + 1}</span>{" "}
                            <span className="code-text">{line}</span>
                          </div>
                        ))}
                    </code>
                  </pre>
                </>
              ) : (
                <p>Select a file to view its content</p>
              )}
            </div>

            <div className="comments-section">
              <h3>Comments</h3>
              {fileCommentsList.length > 0 ? (
                fileCommentsList.map(comment => (
                  <div key={comment.id} className="comment">
                    <strong>Line {comment.line_number}:</strong> {comment.comment}
                  </div>
                ))
              ) : (
                <p>No comments yet</p>
              )}

              {selectedFile && (
                <>
                  <input
                    type="text"
                    placeholder="Line Number"
                    value={lineNumbers[selectedFile?.id] || ""}
                    onChange={(e) =>
                      setLineNumbers(prev => ({ ...prev, [selectedFile.id]: e.target.value }))
                    }
                  />
                  <input
                    type="text"
                    placeholder="Add a comment"
                    value={fileComments[selectedFile?.id] || ""}
                    onChange={(e) =>
                      setFileComments(prev => ({ ...prev, [selectedFile.id]: e.target.value }))
                    }
                  />
                  <button onClick={submitComment}>Submit</button>
                </>
              )}
            </div>
          </div>
        </div>
      }
    />
  );
}

export default CodeReview;
