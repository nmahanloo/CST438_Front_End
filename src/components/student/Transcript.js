import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';

const Transcript = () => {
    const { user } = useOutletContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transcript, setTranscript] = useState([]);
    const [message, setMessage] = useState('');
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchTranscript = async () => {
            const jwt = sessionStorage.getItem('jwt');
            try {
                const response = await fetch(`${SERVER_URL}/transcripts?studentId=${user.studentId}`, {
                    headers: {
                        'Authorization': jwt,
                    },
                });
                console.log('Response:', response);
                if (!response.ok) {
                    throw new Error('Failed to fetch transcript');
                }
                const data = await response.json();
                console.log('Data received:', data);
                setTranscript(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching transcript:', error);
                setError(error);
                setLoading(false);
            }
        };

        fetchTranscript();

        // No cleanup function needed here
    }, [user.studentId]);

    return (
        <div>
            <h3>Transcript</h3>
            {loading ? (
                <p>Loading transcript...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error.message}</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Semester</th>
                            <th>Course ID</th>
                            <th>Section ID</th>
                            <th>Title</th>
                            <th>Credits</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transcript.map((enrollment) => (
                            <tr key={enrollment.enrollmentId}>
                                <td>{enrollment.year}</td>
                                <td>{enrollment.semester}</td>
                                <td>{enrollment.courseId}</td>
                                <td>{enrollment.sectionId}</td>
                                <td>{enrollment.title}</td>
                                <td>{enrollment.credits}</td>
                                <td>{enrollment.grade || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Transcript;