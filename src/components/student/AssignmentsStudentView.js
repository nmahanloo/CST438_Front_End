import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';

const AssignmentsStudentView = () => {
    const { user } = useOutletContext();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [yearSemester, setYearSemester] = useState([]);
    
    useEffect(() => {
        const fetchYearSemester = async () => {
            const jwt = sessionStorage.getItem('jwt');
            try {
                const response = await fetch(`${SERVER_URL}/transcripts?studentId=${user.studentId}`, {
                    headers: {
                        'Authorization': jwt,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch transcripts');
                }
                const data = await response.json();
                // Extract unique year and semester values
                const uniqueYearSemester = data.reduce((acc, item) => {
                    const key = `${item.year}-${item.semester}`;
                    if (!acc.includes(key)) {
                        acc.push({ year: item.year, semester: item.semester });
                    }
                    return acc;
                }, []);
                setYearSemester(uniqueYearSemester);
                // Fetch assignments for each unique year and semester
                fetchAssignments(uniqueYearSemester);
            } catch (error) {
                console.error('Error fetching year and semester:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        const fetchAssignments = async (yearSemesterArray) => {
            const jwt = sessionStorage.getItem('jwt');
            try {
                const promises = yearSemesterArray.map(({ year, semester }) =>
                    fetch(`${SERVER_URL}/assignments?studentId=${user.studentId}&year=${year}&semester=${semester}`, {
                        headers: {
                            'Authorization': jwt,
                        },
                    }).then(response => response.json())
                );
                const results = await Promise.all(promises);
                // Flatten the results array and remove duplicates
                const allAssignments = results.flat();
                setAssignments(allAssignments);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching assignments:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchYearSemester();
    }, [user.studentId]);

    if (loading) {
        return <p>Loading assignments...</p>;
    }

    return (
        <>
            <h3>Assignments</h3>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {assignments.length === 0 ? (
                <p>No assignments found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Course Id</th>
                            <th>Assignment Title</th>
                            <th>Assignment DueDate</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map((assignment, index) => (
                            <tr key={index}>
                                <td>{assignment.courseId}</td>
                                <td>{assignment.title}</td>
                                <td>{assignment.dueDate}</td>
                                <td>{assignment.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default AssignmentsStudentView;