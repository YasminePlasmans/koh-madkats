import React, {useState, useEffect} from "react"

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Slide,
    FormControl,
    FormGroup,
    Switch,
    FormControlLabel,
    Typography,
    IconButton,
    useMediaQuery,
    TextField
} from "@material-ui/core"

import { Autocomplete } from '@material-ui/lab'

import Close from "@material-ui/icons/Close"
import Save from "@material-ui/icons/Save"


import {useQuery, useMutation} from '@apollo/react-hooks';

import MomentUtils from '@date-io/moment';
import moment from 'moment'

import {
    DatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';

import {GET_MEMBERS, INSERT_DCC, INSERT_DCC_BY_MEMBER, QUERY_DCC_BY_DATE, DELETE_DCC_BY_MEMBER, DELETE_DCC, DELETE_DCC_BY_DCCID} from "./DCC.config"

export default function UpdateDay({open, setOpen, preselectedDate}) {
    const matches = useMediaQuery('(max-width:600px)')

    moment.locale("en")
    const [selectedDate, setSelectedDate] = useState(new Date(preselectedDate));
    
    useEffect(() => {
        setSelectedDate(new Date(preselectedDate))
    }, [preselectedDate])

    const [sepulcherDay, setSepulcherDay] = useState(false);

    const [loading, setLoading] = useState(false)

    const [membersMissed, setMembersMissed] = useState([]);
    const [membersMissedSepulcher, setMembersMissedSepulcher] = useState([]);
    const [initialValues, setInitialValues] = useState()

    const {data} = useQuery(GET_MEMBERS)
    const members = data?.members || []

    useQuery(QUERY_DCC_BY_DATE, {
        variables: { date: moment(selectedDate).format("yyyy-MM-DD") },
        onCompleted: (data) => {
            setSepulcherDay(data.dcc.length > 1)
            const dccDay = data.dcc.find(day => day.dccType === "dcc")
            const sepulcher = data.dcc.find(day => day.dccType === "sepulcher")

            let initialValues = {}

            const membersDCC = dccDay?.dcc_per_members.map(day => ({
                ign: day.member.ign,
                id: day.member.id,
                dccid: day.id
            }))

            initialValues.dccid = dccDay && dccDay.id
            initialValues.membersMissed = membersDCC
            setMembersMissed(membersDCC)

            if(sepulcher) {
                const membersSepulcher = sepulcher.dcc_per_members.map(day => ({
                    ign: day.member.ign,
                    id: day.member.id,
                    dccid: day.id
                }))
                initialValues.sepulcherDay = true
                initialValues.sepulcherid = sepulcher.id
                initialValues.membersMissedSepulcher = membersSepulcher
                setMembersMissedSepulcher(membersSepulcher)
            }

            setInitialValues(initialValues)
        }
    });

    const handleClose = () => {
        setOpen(false)
    }

    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    const [insertDCC] = useMutation(INSERT_DCC);
    const [insertDCCByMember] = useMutation(INSERT_DCC_BY_MEMBER);
    const [deleteDCCByMember] = useMutation(DELETE_DCC_BY_MEMBER);
    const [deleteDCCBydccID] = useMutation(DELETE_DCC_BY_DCCID);
    const [deleteDCC] = useMutation(DELETE_DCC);

    async function removeMembers(array, dccid, processFunction) {
        for (const record of array) {
            await processFunction({
                variables: {
                    memberid: record.id,
                    dccid
                }
            })
        }
    }

    async function addNewMembers(array, dccid, processFunction) {
        for (const record of array) {
            await processFunction({
                variables: {
                    memberid: record.id,
                    dccid
                }
            })
        }
    }

    const handleSave = async () => {
        setLoading(true)

        let newInitialValues = {}

        newInitialValues.membersMissed = membersMissed
        newInitialValues.dccid = initialValues.dccid

        const newMembersMissed = membersMissed.filter(member => !initialValues.membersMissed.find(initial => initial.id === member.id))
        const removedMembersMissed = initialValues.membersMissed.filter(member => !membersMissed.find(initial => initial.id === member.id))

        await addNewMembers(newMembersMissed, initialValues.dccid, insertDCCByMember)
        await removeMembers(removedMembersMissed, initialValues.dccid, deleteDCCByMember)

        if(sepulcherDay && initialValues.sepulcherDay) {
            const newMembersMissedSepulcher = membersMissedSepulcher.filter(member => !initialValues.membersMissed.find(initial => initial.id === member.id))
            const removedMembersMissedSepulcher = initialValues.membersMissedSepulcher.filter(member => !membersMissed.find(initial => initial.id === member.id))
            await addNewMembers(newMembersMissedSepulcher, initialValues.sepulcherid, insertDCCByMember)
            await removeMembers(removedMembersMissedSepulcher, initialValues.sepulcherid, deleteDCCByMember)

            newInitialValues.membersMissedSepulcher = membersMissedSepulcher
            newInitialValues.sepulcherid = initialValues.sepulcherid
        }

        if(!sepulcherDay && initialValues.sepulcherDay) {
            await deleteDCCBydccID({
                variables: {
                    dccid: initialValues.sepulcherid
                }
            })
            await deleteDCC({
                variables: {
                    id: initialValues.sepulcherid
                }
            })
        }

        if(sepulcherDay && !initialValues.sepulcherDay) {
            const date = moment(selectedDate).startOf('day').format("yyyy-MM-DD")
            const responseDCCSepulcher = await insertDCC({variables: {date, dccType: "sepulcher"}})

            const dccidSepulcher = responseDCCSepulcher.data.insert_dcc.returning[0].id

            await function createDCCRecords () {
                membersMissedSepulcher.forEach(member => {
                    insertDCCByMember({
                        variables: {
                            memberid: member.id,
                            dccid: dccidSepulcher
                        }
                    })
                })
            }()

            newInitialValues.membersMissedSepulcher = membersMissedSepulcher
            newInitialValues.sepulcherid = initialValues.sepulcherid
        }

        setInitialValues(newInitialValues)
        setOpen(false)
        setLoading(false)
    }


    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
                TransitionComponent={Transition}
                fullScreen={matches}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="form-dialog-title">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">Update DCC</Typography>
                        <IconButton
                            onClick={ handleClose }
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box pb="16px">
                        <MuiPickersUtilsProvider libInstance={moment} utils={MomentUtils} locale="en">
                            <DatePicker
                                disabled
                                autoOk
                                disableToolbar
                                value={selectedDate}
                                onChange={handleDateChange}
                                label="Date"
                                inputVariant="outlined"
                                maxDate={new Date()}
                            />
                        </MuiPickersUtilsProvider>
                    </Box>
                    <Box pb="16px">
                        <FormControl component="fieldset">
                            <FormGroup>
                                <FormControlLabel
                                    control={<Switch checked={sepulcherDay} onChange={(evt => setSepulcherDay(evt.target.checked))} name="gilad" />}
                                    label="Sepulcher Mulcher day"
                                />
                            </FormGroup>
                        </FormControl>
                    </Box>
                    <Box pb="16px">
                        <Autocomplete
                            options={members}
                            value={membersMissed}
                            getOptionSelected={(option, value) => option.id === value.id}
                            multiple
                            disableCloseOnSelect
                            onChange={(evt, value) => setMembersMissed(value)}
                            getOptionLabel={(option) => option.ign}
                            renderInput={(params) => <TextField {...params} label="Members who failed DCC" variant="outlined" />}
                        />
                    </Box>
                    {
                        sepulcherDay && <Box pb="16px">
                            <Autocomplete
                                options={members}
                                value={membersMissedSepulcher}
                                getOptionSelected={(option, value) => option.id === value.id}
                                multiple
                                disableCloseOnSelect
                                onChange={(evt, value) => setMembersMissedSepulcher(value)}
                                getOptionLabel={(option) => option.ign}
                                renderInput={(params) => <TextField {...params} label="Members who failed Sepulcher" variant="outlined" />}
                            />
                        </Box>
                    }
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => handleSave()}
                        color="primary"
                        variant="contained"
                        fullWidth
                        startIcon={<Save />}
                        disabled={loading}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
