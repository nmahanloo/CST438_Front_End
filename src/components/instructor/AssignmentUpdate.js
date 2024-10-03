import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const AssignmentUpdate = (props)  => {

  const [open, setOpen] = useState(false);
  const [editMessage, setEditMessage] = useState('');
  const [assignment, setAssignment] = useState({id:'', courseId:'', secId:' ', title:'', dueDate:''});

  /*
   *  dialog for edit of an assignment
   */
  const editOpen = () => {
    setOpen(true);
    setEditMessage('');
    setAssignment(props.assignment);
  };

  const editClose = () => {
    setOpen(false);
    setAssignment({id:'', courseId:'', secId:' ', title:'', dueDate:''});
    setEditMessage('');
  };

  const editChange = (event) => {
    setAssignment({...assignment,  [event.target.name]:event.target.value})
  }

  const onSave = () => {
    props.save(assignment);
    editClose();
  }

  return (
      <>
        <Button onClick={editOpen}>Edit</Button>
        <Dialog open={open} >
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogContent  style={{paddingTop: 20}} >
            <h4>{editMessage}</h4>
            <TextField style={{padding:10}} autoFocus fullWidth label="id" name="id" value={assignment.id} InputProps={{readOnly: true, }}  />
            <TextField style={{padding:10}} autoFocus fullWidth label="title" name="title" value={assignment.title} onChange={editChange}  />
            <TextField style={{padding:10}} fullWidth label="dueDate" name="dueDate" value={assignment.dueDate} onChange={editChange}  />
          </DialogContent>
          <DialogActions>
            <Button color="secondary" onClick={editClose}>Close</Button>
            <Button color="primary" onClick={onSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </>
  )
}

export default AssignmentUpdate;
