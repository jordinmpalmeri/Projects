# Collaborative Coding Feedback Platform

A web-based platform designed for introductory computer science courses. The system allows teachers to create classes and assignments, form student groups, and enable students to submit code and provide feedback on each other's work. The goal was to support peer review and collaborative learning in programming environments.

This project was developed using React for the frontend and Django for the backend. Our team followed a Scrum development methodology.

### Note: Some backend data and configuration are no longer available, so the application is not currently runnable. This repository is intended for reference and demonstration of development work.

## Features

Teacher dashboard for creating assignments and organizing student groups

Student interface for submitting code solutions

Code review page for viewing submissions and giving feedback

Peer-to-peer commenting to support collaborative learning

Tech Stack

Frontend: React

Backend: Django

Version Control: Git & GitHub

## My Contributions
# Sprint 1

  - Implemented the CreateAssignment page and group randomization functionality

  - Built the AssignmentDetails and CodeReview pages (frontend)

  - Implemented the code submission feature and ensured submissions appeared correctly on the review page

  - Refactored the CoursesView page for consistent structure and formatting

# Sprint 2

  - Took on a major role in backend development, pair-programming most backend features

  - Solely implemented the backend logic for CodeReview, including:

     - Handling code submissions

     - API integrations to support frontend needs

     - Designing and revising the commenting workflow

  - Modified the code review interaction model for reliability:

     - Changed from highlight-based comments to a structured input form (line number + comment)

     - Updated submission viewing so users select individual files instead of displaying all at once

## Known Limitations / Future Work

  - Teachers cannot edit assignments after creation

  - Usernames are not displayed next to comments

  - Code highlighting comment feature was replaced with a simpler, more reliable input-based approach

## Acknowledgments

This project was built collaboratively by a multi-person development team. Frequent communication, daily standups, and pair programming were key in maintaining progress and resolving issues efficiently.
