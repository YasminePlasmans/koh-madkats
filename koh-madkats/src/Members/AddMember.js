import React, {useState, useEffect} from "react"

import isEmpty from 'lodash/isEmpty'

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Button,
    Box,
    InputAdornment
} from "@material-ui/core"

import { useMutation } from "@apollo/react-hooks";
import gql from 'graphql-tag'

const ADD_MEMBER = gql `
    mutation Add_Member ($ign: String!, $might: float8!, $rank: String!, $archived: Boolean!) {
        insert_members(objects: {ign: $ign, might: $might, rank: $rank}){
            affected_rows
            returning {
              id
              ign
              might
              rank
            }
        }
    }
 `

 const UPDATE_MEMBER = gql `
    mutation Update_Member ($id: uuid!, $ign: String!, $might: float8!, $rank: String!, $archived: Boolean!) {
        update_members(where: {id: {_eq: $id}}, _set: {archived: $archived, ign: $ign, might: $might, rank: $rank}){
            affected_rows
            returning {
            id
            ign
            might
            rank
            }
        }
    }
`

export default function AddMember({open, setOpen, defaultValues = {}}) {
    const handleClose = () => {
        setEdit(false)
        setOpen(false)
    }

    const handleAdd = () => {
        setOpen(false)
        addMember({
            variables: values,
            onError: (error) => {
                console.log(error)
            }
        })
    }

    const handleSave = (id) => {
        setEdit(false)
        setOpen(false)
        updateMember({variables: {
            id,
            ign: values.ign,
            might: values.might,
            rank: values.rank,
            archived: values.archived
        }})
    }

    const [values, setValues] = useState({archived: false, ...defaultValues})
    const [edit, setEdit] = useState(false)

    const [addMember, {error: addError}] = useMutation(ADD_MEMBER);
    const [updateMember] = useMutation(UPDATE_MEMBER);

    useEffect(() => {
        setValues({
            archived: false,
            ...defaultValues
        })

        if(!isEmpty(defaultValues)) setEdit(true)
    }, [defaultValues])

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">
                {edit ? "Edit member" : "Add member"}
            </DialogTitle>

            <DialogContent>
                <Box pb="16px">
                    <TextField
                        autoFocus
                        id="ign"
                        label="In game name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        onChange={(event) => {
                            setValues({
                                ...values,
                                ign: event.target.value
                            })
                        }}
                        defaultValue={values.ign}
                    />
                </Box>
                <Box pb="16px">
                    <TextField
                        id="might"
                        label="Might"
                        type="number"
                        fullWidth
                        variant="outlined"
                        onChange={(event) => {
                            setValues({
                                ...values,
                                might: event.target.value
                            })
                        }}
                        defaultValue={values.might}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">M</InputAdornment>,
                        }}
                    />
                </Box>
                <Box pb="16px">
                    <TextField
                        id="rank"
                        label="Rank"
                        select
                        fullWidth
                        variant="outlined"
                        onChange={(event) => {
                            setValues({
                                ...values,
                                rank: event.target.value
                            })
                        }}
                        value={values.rank || ''}
                    >
                        <MenuItem value="CCO"> CCO </MenuItem>
                        <MenuItem value="VP"> VP </MenuItem>
                        <MenuItem value="R3"> R3 </MenuItem>
                        <MenuItem value="R2"> R2 </MenuItem>
                        <MenuItem value="R1"> R1 </MenuItem>
                    </TextField>
                </Box>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                {
                    edit
                    ? <Button onClick={() => handleSave(values.id)} color="primary">
                        Save
                    </Button>
                    : <Button onClick={handleAdd} color="primary">
                        Add
                    </Button>
                }
                
            </DialogActions>
        </Dialog>
    )
}
    