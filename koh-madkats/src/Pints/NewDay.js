import React, {useState} from "react"

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField
} from "@material-ui/core"

import {useQuery} from '@apollo/react-hooks';
// import gql from 'graphql-tag'

import MomentUtils from '@date-io/moment';
import moment from 'moment'

import {
    DatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';

import { Autocomplete } from "@material-ui/lab"

import {GET_MEMBERS, pintTypes} from "./Pints.config"

export default function NewDay({open, setOpen}) {
    moment.locale("en");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [members, setMembers] = useState()
    const [pintType, setPintType] = useState("pint")

    const {data} = useQuery(GET_MEMBERS)

    const handleClose = () => {
        setOpen(false)
    }

    const updateMembers = (event, value) => {
        setMembers(value)
    }
    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    const updateRaidType = (event, value) => {
        setPintType(value.value)
    }  

    const handleSave = () => {
        const date = moment(selectedDate).startOf('day').format()
        console.log(date)
        console.log(members)
        console.log(pintType)
    }

    return (
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="sm" fullWidth>
            <DialogTitle id="form-dialog-title">
                Pints
            </DialogTitle>

            <DialogContent>
                <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="en">
                    <Box pb="16px">
                        <DatePicker
                            autoOk
                            disableToolbar
                            value={selectedDate}
                            onChange={handleDateChange}
                            label="Date"
                            inputVariant="outlined"
                            maxDate={new Date()}
                        />
                    </Box>
                    <Box pb="16px">
                        <Autocomplete
                            options={pintTypes}
                            defaultValue={{
                                label: "Pint",
                                value: "pint"
                            }}
                            getOptionLabel={(option) => option.label}
                            renderOption={(option) => (
                                <React.Fragment>
                                  <span>{option.label}</span>
                                </React.Fragment>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Pint type"
                                    variant="outlined"
                                    inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                    }}
                                />
                            )}
                            onChange={updateRaidType}
                        />
                    </Box>
                    <Box pb="16px">
                        <Autocomplete
                            options={data?.members || []}
                            multiple
                            getOptionLabel={(option) => option.ign}
                            renderOption={(option) => (
                                <React.Fragment>
                                  <span>{option.ign}</span>
                                </React.Fragment>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Members"
                                    variant="outlined"
                                    inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password', // disable autocomplete and autofill
                                    }}
                                />
                            )}
                            onChange={updateMembers}
                        />
                    </Box>
                </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}