# Jobly Backend

Jobly is a full stack web application of a mock job board site where users can sign up and login. Logged in users gain access to a list of companies with search and filtering capabilities. Each company has a list of job postings that a user can view. A user may apply to a job posting, but each user is restricted from duplicate applications to a single job posting posted by a company.

# Current Features

- Add optional filtering of job postings by title, salary and equity
- Add ability for users to submit job applications
- When admins add a user the system makes a random password for the user
- Use enum types in PostgreSQL to change the state column in the applications table to consist of 'interested', 'applied', 'accepted', 'rejected'
- Add technologies for jobs
- Add technologies for users

To run this:

    node server.js

To run the tests:

    jest -i
