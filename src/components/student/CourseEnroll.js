import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';

const CourseEnroll = () => {
  const { user } = useOutletContext(); // Access user object from context
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [key, setKey] = useState(0); // State to trigger useEffect

  useEffect(() => {
    const fetchSections = async () => {
      const jwt = sessionStorage.getItem('jwt');
      try {
        const response = await fetch(`${SERVER_URL}/sections/open`, {
          headers: {
            'Authorization': jwt,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch sections');
        }
        const data = await response.json();
        console.log('Sections data:', data);
        setSections(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching sections:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchSections();
  }, [key]); // Add key to dependency array to re-run useEffect when key changes

  const enrollInSection = async (sectionNo) => {
    const jwt = sessionStorage.getItem('jwt');
    try {
      const response = await fetch(`${SERVER_URL}/enrollments/sections/${sectionNo}?studentId=${user.studentId}`, {
        method: 'POST',
        headers: {
          'Authorization': jwt,
        },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }
      await response.json();
      alert('Enrolled successfully!');
      setError(null); // Clear any previous error
      setKey(key + 1); // Change key to trigger useEffect
    } catch (error) {
      console.error('Error enrolling in section:', error);
      if (error.message.includes('student has already enrolled')) {
        alert('Error: Student has already enrolled in this section');
      } else if (error.message.includes('the enrollment date is not valid')) {
        alert('Error: Enrollment date has passed');
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  if (loading) {
    return <p>Loading sections...</p>;
  }

  return (
    <div>
      <h3>Course Enrollment</h3>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <ul>
        {sections.length > 0 ? (
          sections.map((section) => (
            <li key={section.secNo}>
              {section.year} - {section.semester} - {section.courseId} - {section.title} - {section.instructorName}
              <button onClick={() => enrollInSection(section.secNo)}>Enroll</button>
            </li>
          ))
        ) : (
          <p>No sections available for enrollment</p>
        )}
      </ul>
    </div>
  );
};

export default CourseEnroll;