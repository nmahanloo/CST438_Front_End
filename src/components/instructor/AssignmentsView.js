import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Button from '@mui/material/Button';
import { SERVER_URL } from '../../Constants';
import AssignmentAdd from './AssignmentAdd';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentGrade from './AssignmentGrade';

const AssignmentsView = (props) => {
    const [assignments, setAssignments] = useState([]);
    const [message, setMessage] = useState('');

    const location = useLocation();
    const { secNo, courseId, secId } = location.state;

    const fetchAssignments = async () => {
        if (!secNo) return;
        try {
            const token = sessionStorage.getItem("jwt");
            const response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            if (response.ok) {
                const data = await response.json();
                setAssignments(data);
            } else {
                const rc = await response.json();
                setMessage("fetch error " + rc.message);
            }
        } catch (err) {
            setMessage("network error " + err);
        }
    }

    useEffect(() => {
        fetchAssignments();
    }, [secNo]);

    const add = async (assignment) => {
        assignment.courseId = courseId;
        assignment.secId = secId;
        assignment.secNo = secNo;
        try {
            const token = sessionStorage.getItem("jwt");
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(assignment),
            });
            if (response.ok) {
                const data = await response.json();
                setMessage("Assignment created id=" + data.id);
                fetchAssignments(); // This should be fine here
            } else {
                const rc = await response.json();
                setMessage("create error " + rc.message);
            }
        } catch (err) {
            setMessage("network error " + err);
        }
    }

    const save = async (assignment) => {
        try {
            const token = sessionStorage.getItem("jwt");
            const response = await fetch(`${SERVER_URL}/assignments`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(assignment),
            });
            if (response.ok) {
                setMessage("Assignment saved");
                fetchAssignments(); // This should be fine here
            } else {
                const rc = await response.json();
                setMessage("save error " + rc.message);
            }
        } catch (err) {
            setMessage("network error " + err);
        }
    }

    const doDelete = async (e) => {
        const row_idx = e.target.closest('tr').rowIndex - 1;
        const id = assignments[row_idx].id;
        try {
            const token = sessionStorage.getItem("jwt");
            const response = await fetch(`${SERVER_URL}/assignments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            });
            if (response.ok) {
                fetchAssignments(); // Refresh the assignments list
            }
        } catch (err) {
            console.error("network error " + err); // Log the error instead of setting the message
        }
    }

    const onDelete = (e) => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Do you really want to delete?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => doDelete(e)
                },
                {
                    label: 'No',
                }
            ]
        });
    }

    const headers = ['id', 'Title', 'Due Date', '', '', ''];

    return (
        <div>
            <h3>{message}</h3>

            {assignments.length > 0 &&
                <>
                    <h3>{courseId}-{secId} Assignments</h3>

                    <table className="Center">
                        <thead>
                        <tr>
                            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {assignments.map((a) => (
                            <tr key={a.id}>
                                <td>{a.id}</td>
                                <td>{a.title}</td>
                                <td>{a.dueDate}</td>
                                <td><AssignmentGrade assignment={a} /></td>
                                <td><AssignmentUpdate assignment={a} save={save} /></td>
                                <td><Button onClick={onDelete}>Delete</Button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </>
            }

            <AssignmentAdd save={add} />
        </div>
    );
}

export default AssignmentsView;
