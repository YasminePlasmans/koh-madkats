import React, {useState} from "react"
import moment from 'moment'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup
} from "@material-ui/core"

import { useMutation } from "@apollo/react-hooks";
import gql from 'graphql-tag'

const ARCHIVE_MEMBER = gql`
mutation archiveMember ($id: uuid!, $reason: String!, $type: String!, $archiveDate: date!) {
    update_members(where: {id: {_eq: $id}}, _set: {archived: true, archiveReason: $reason, archiveType: $type, archiveDate: $archiveDate}){
        affected_rows
    }
}`

const DELETE_MEMBER = gql`
mutation deleteMember ($id: uuid!) {
    delete_members(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`

 export default function RemoveMember({open, setOpen, member}) {

    const [type, setType] = useState()
    const [reason, setReason] = useState()

    const [archiveMember] = useMutation(ARCHIVE_MEMBER);
    const [delete_members_by_pk] = useMutation(DELETE_MEMBER);

    const handleDelete = () => {
        delete_members_by_pk({
            variables: {
                id: member.id
            },
            update: cache => {
                setOpen(false)
            }
        })
    }
    const handleArchive = () => {
        archiveMember({
            variables: {
                id: member.id,
                type,
                reason,
                archiveDate: moment().format('yyyy-MM-DD')
            },
            update: cache => {
                setOpen(false)
            }
        })
    }

    const handleClose = () => {
        setOpen(false)
    }


    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">
                {`Archive member ${member?.ign}`}
            </DialogTitle>

            <DialogContent>
                <Box pb="16px">
                    <FormControl component="fieldset">
                    <RadioGroup
                        name="archiveType"
                        onChange={(event) => {
                            setType(event.currentTarget.value)
                        }}>
                        <FormControlLabel value="kicked" control={<Radio />} label="Kicked" />
                        <FormControlLabel value="left" control={<Radio />} label="Left" />
                    </RadioGroup>
                    </FormControl>
                </Box>
                <Box pb="16px">
                    <TextField
                        autoFocus
                        id="reason"
                        label="Reason"
                        type="text"
                        multiline
                        fullWidth
                        variant="outlined"
                        onChange={(event) => {
                            setReason(event.target.value)
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete}>
                    Hard delete
                </Button>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleArchive} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
 }