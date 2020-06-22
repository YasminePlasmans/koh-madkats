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
// import gql from 'graphql-tag'

import MomentUtils from '@date-io/moment';
import moment from 'moment'

import {
    DatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';

import {GET_MEMBERS, INSERT_DCC, INSERT_DCC_BY_MEMBER, QUERY_DCC_BY_DATE} from "./DCC.config"

export default function NewDay({open, setOpen, preselectedDate}) {
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

    const {data} = useQuery(GET_MEMBERS)
    const members = data?.members || []

    const [dateLogged, setDateLogged] = useState(false)
    useQuery(QUERY_DCC_BY_DATE, {
        variables: { date: moment(selectedDate).format("yyyy-MM-DD") },
        onCompleted: (data) => {
            setDateLogged(data.dcc.length > 0)
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

    const handleSave = async () => {
        setLoading(true)
        const date = moment(selectedDate).startOf('day').format("yyyy-MM-DD")

        const responseDCC = await insertDCC({variables: {date, dccType: "dcc"}})

        const dccid = responseDCC.data.insert_dcc.returning[0].id

        await function createDCCRecords () {
            membersMissed.forEach(member => {
                insertDCCByMember({
                    variables: {
                        memberid: member.id,
                        dccid
                    }
                })
            })
        }()

        if (sepulcherDay) {
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
        }

        setOpen(false)
        setSelectedDate(new Date())
        setMembersMissed([])
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
                        <Typography variant="h5">Register DCC</Typography>
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
                                autoOk
                                disableToolbar
                                value={selectedDate}
                                onChange={handleDateChange}
                                label="Date"
                                inputVariant="outlined"
                                maxDate={new Date()}
                                error={dateLogged}
                                helperText={dateLogged ? 'This date has already been logged, please use the edit screen instead' : ''}
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
                        disabled={dateLogged || loading}
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
