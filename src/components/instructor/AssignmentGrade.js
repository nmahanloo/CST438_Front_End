import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';

const AssignmentGrade = (props) => {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [grades, setGrades] = useState([]);


    const editOpen = () => {
        setOpen(true);
        setMessage('');
        fetchGrades(props.assignment.id);
    };

    const fetchGrades = async (id) => {
        try {
            const token = sessionStorage.getItem("jwt");
            const response = await fetch(`${SERVER_URL}/assignments/${id}/grades`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                }
            });
            if (response.ok) {
                const data = await response.json();
                setGrades(data);
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error "+err);
        }
    }

    const onSave = async () => {
        try {
            const token = sessionStorage.getItem("jwt");
            const response = await fetch (`${SERVER_URL}/grades`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify(grades),
            });
            if (response.ok) {
                setMessage("Grades saved");
            } else {
                const rc = await response.json();
                setMessage(rc.message);
            }
        } catch (err) {
            setMessage("network error "+err);
        }
    }

    const editClose = () => {
        setOpen(false);
        setGrades([]);
        setMessage('');
    };

    const onChange = (e) => {
        const copy_grades = grades.map((x) => x);
        const row_idx = e.target.parentNode.parentNode.rowIndex - 1;
        copy_grades[row_idx] = {...(copy_grades[row_idx]), score: e.target.value};
        setGrades(copy_grades);
    }

    const headers = ['gradeId', 'student name', 'student email', 'score' ];

    return(
        <>
            <Button onClick={editOpen}>Grade</Button>
            <Dialog open={open} >
                <DialogTitle>Grade Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <h4>{message}</h4>
                    <table className="Center" >
                        <thead>
                        <tr>
                            {headers.map((s, idx) => (<th key={idx}>{s}</th>))}
                        </tr>
                        </thead>
                        <tbody>
                        {grades.map((g) => (
                            <tr key={g.gradeId}>
                                <td>{g.gradeId}</td>
                                <td>{g.studentName}</td>
                                <td>{g.studentEmail}</td>
                                <td><input type="text"  name="score" value={g.score}  onChange={onChange} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={editClose}>Close</Button>
                    <Button color="primary" onClick={onSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AssignmentGrade;
