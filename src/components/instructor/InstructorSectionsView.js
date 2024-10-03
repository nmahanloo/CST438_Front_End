import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { SERVER_URL } from '../../Constants';

const InstructorSectionsView = (props) => {
    const [sections, setSections] = useState([]);
    const [message, setMessage] = useState('');

    const location = useLocation();
    const { year, semester } = location.state;

    const fetchSections = async (year, semester) => {
        if (!year || year === '' || !semester || semester === '') {
            setMessage("Enter year and semester");
            return;
        }
        try {
            const response = await fetch(`${SERVER_URL}/sections?year=${year}&semester=${semester}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': sessionStorage.getItem('jwt')
                }
            });

            if (response.ok) {
                const data = await response.json();
                setSections(data);
            } else {
                setMessage("Failed to fetch sections");
            }
        } catch (err) {
            setMessage("Network error: " + err.message);
        }
    }

    useEffect(() => {
        fetchSections(year, semester);
    }, [year, semester]);

    const headers = ['secNo', 'course id', 'sec id', 'building', 'room', 'times', '', ''];

    return (
        <div>
            <h3>{message}</h3>
            {sections.length > 0 &&
                <>
                    <h3>Sections {year} {semester}</h3>
                    <table className="Center">
                        <thead>
                        <tr>
                            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {sections.map((s) => (
                            <tr key={s.secNo}>
                                <td>{s.secNo}</td>
                                <td>{s.courseId}</td>
                                <td>{s.secId}</td>
                                <td>{s.building}</td>
                                <td>{s.room}</td>
                                <td>{s.times}</td>
                                <td><Link to="/enrollments" state={s}>Enrollments</Link></td>
                                <td><Link to="/assignments" state={s}>Assignments</Link></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            }
        </div>
    );
}

export default InstructorSectionsView;
