import React, {useState, useEffect} from "react"

import size from "lodash/size"
import each from "lodash/each"

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Slide,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Checkbox,
    Typography,
    IconButton,
    useMediaQuery
} from "@material-ui/core"

import Close from "@material-ui/icons/Close"
import Save from "@material-ui/icons/Save"
import ChevronRight from "@material-ui/icons/ChevronRight"
import ChevronLeft from "@material-ui/icons/ChevronLeft"


import Icon from '@mdi/react'

import { mdiCheckBoxMultipleOutline } from '@mdi/js'
import { mdiCheckBoxOutline } from '@mdi/js'

import { mdiCheckboxBlankOutline } from '@mdi/js';


import {useQuery, useMutation} from '@apollo/react-hooks';
// import gql from 'graphql-tag'

import MomentUtils from '@date-io/moment';
import moment from 'moment'

import {
    DatePicker,
    MuiPickersUtilsProvider
} from '@material-ui/pickers';

import {GET_MEMBERS, INSERT_PINTS, INSERT_PINTS_BY_MEMBER, QUERY_PINTS_BY_DATE} from "./Pints.config"
import { useStyles } from "./Pints"

export default function NewDay({open, setOpen, preselectedDate}) {
    const matches = useMediaQuery('(max-width:600px)')

    const classes = useStyles()
    moment.locale("en")
    const [selectedDate, setSelectedDate] = useState(new Date(preselectedDate));

    useEffect(() => {
        setSelectedDate(new Date(preselectedDate))
    }, [preselectedDate])

    const [memberPints, setMemberPints] = useState({})
    const [memberRaidPints, setMemberRaidPints] = useState({})

    const [loading, setLoading] = useState(false)

    const [firstScreenActive, setFirstScreenActive] = useState(true);

    const {data} = useQuery(GET_MEMBERS)
    const members = data?.members

    const [dateLogged, setDateLogged] = useState(false)
    useQuery(QUERY_PINTS_BY_DATE, {
        variables: { date: moment(selectedDate).format("yyyy-MM-DD") },
        onCompleted: (data) => {
            setDateLogged(data.pints.length > 0)
        }
    });

    useEffect(() => {
        let pintInitialisation = {}

        members && members.forEach(member => {
            pintInitialisation[member.id] = 0
        })

        setMemberPints(pintInitialisation || {})

        let raidpintInitialisation = {}
        members && members.forEach(member => {
            raidpintInitialisation[member.id] = 0
        })

        setMemberRaidPints(raidpintInitialisation || {})

    }, [members])

    const handleClose = () => {
        setOpen(false)
    }

    const handleDateChange = (date) => {
        setSelectedDate(date)
    }

    const [insertPints] = useMutation(INSERT_PINTS);
    const [insertPintsByMember] = useMutation(INSERT_PINTS_BY_MEMBER);

    const handleSave = async () => {
        setLoading(true)
        const date = moment(selectedDate).startOf('day').format("yyyy-MM-DD")

        const responsePint = await insertPints({variables: {date, pintType: "pint", membersFinished: size(memberPints), membersAmount: size(memberPints)}})
        const responseRaidPint = await insertPints({variables: {date, pintType: "raidPint", membersFinished: size(memberPints), membersAmount: size(memberPints)}})

        const pintid = responsePint.data.insert_pints.returning[0].id
        const raidPintid = responseRaidPint.data.insert_pints.returning[0].id

        await function createPints () {
            each(memberPints, (value, key) => {
                insertPintsByMember({
                    variables: {
                        memberid: key,
                        pintid,
                        bought: value
                    }
                })
            })


            each(memberRaidPints, (value, key) => {
                insertPintsByMember({
                    variables: {
                        memberid: key,
                        pintid: raidPintid,
                        bought: value
                    }
                })
            })
        }()

        setOpen(false)
        setSelectedDate(new Date())
        setMemberPints({})
        setMemberRaidPints({})
        setFirstScreenActive(true)

        setLoading(false)
    }

    return (
        <>
            <Dialog
                open={open}
                aria-labelledby="form-dialog-title"
                TransitionComponent={Transition}
                fullScreen={matches}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle id="form-dialog-title">
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5">Register pints</Typography>
                        <IconButton
                            onClick={() => {
                                setOpen(false)
                                setFirstScreenActive(true)
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
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
                                    error={dateLogged}
                                    helperText={dateLogged ? 'This date has already been logged, please use the edit screen instead' : ''}
                                />
                            </Box>
                        </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setFirstScreenActive(false)}
                        color="primary"
                        variant="contained"
                        fullWidth
                        endIcon={<ChevronRight />}
                        disabled={dateLogged}
                    >
                        Next
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={!firstScreenActive}
                onClose={handleClose}
                fullScreen={matches}
                fullWidth
                maxWidth="sm"
                TransitionComponent={TransitionLeft}
            >
                <DialogTitle id="form-dialog-title">
                <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle2">Register pints</Typography>
                        <IconButton
                            size="small"
                            onClick={() => {
                                setOpen(false)
                                setFirstScreenActive(true)
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <List>
                        {
                            data?.members?.map(member => (
                                <React.Fragment key={member.id}>
                                    <ListItem dense>
                                        <ListItemText primary={member.ign} primaryTypographyProps={{variant: "subtitle2"}}/>
                                    </ListItem>
                                    <Box display="flex">
                                    <ListItem
                                        dense
                                        className={classes.nested}
                                        button
                                        onClick={() => {
                                            setMemberPints(
                                                {
                                                    ...memberPints,
                                                    [member.id]: memberPints[member.id] ? 0 : 1
                                                }
                                            )
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                size="small"
                                                color="primary"
                                                edge="start"
                                                checked={memberPints[member.id] > 0}
                                                icon={
                                                    <Icon
                                                        path={mdiCheckboxBlankOutline}
                                                        title="Members"
                                                        size={0.8}
                                                    />
                                                }
                                                checkedIcon={
                                                    <Icon
                                                        path={mdiCheckBoxOutline}
                                                        title="Members"
                                                        size={0.8}
                                                    />
                                                }
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={"Pint"}  primaryTypographyProps={{color: "textSecondary"}}/>
                                    </ListItem>
                                    <ListItem
                                        dense
                                        className={classes.nested}
                                        button
                                        onClick={() => {
                                            let value = memberRaidPints[member.id] === 2 ? 0 : ++memberRaidPints[member.id]
                                            setMemberRaidPints({
                                                ...memberRaidPints,
                                                [member.id]: value
                                            })
                                        }}
                                    >
                                        <ListItemIcon>
                                            <Checkbox
                                                size="small"
                                                color="primary"
                                                edge="start"
                                                checked={!!(memberRaidPints[member.id] > 0)}
                                                indeterminate={memberRaidPints[member.id] === 1}
                                                icon={
                                                    <Icon
                                                        path={mdiCheckboxBlankOutline}
                                                        title="Members"
                                                        size={0.8}
                                                    />
                                                }
                                                indeterminateIcon={
                                                    <Icon
                                                        path={mdiCheckBoxOutline}
                                                        title="Members"
                                                        size={0.8}
                                                    />
                                                }
                                                checkedIcon={
                                                    <Icon
                                                        path={mdiCheckBoxMultipleOutline}
                                                        title="Members"
                                                        size={0.8}
                                                    />
                                                }
                                            />
                                        </ListItemIcon>
                                        <ListItemText primary={"Raid\u00a0pint"} primaryTypographyProps={{color: "textSecondary"}} />
                                    </ListItem>
                                    </Box>
                                </React.Fragment>
                            ))
                        }
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setFirstScreenActive(true)}
                        color="primary"
                        variant="outlined"
                        fullWidth
                        disabled={loading}
                        startIcon={<ChevronLeft />}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={handleSave}
                        color="primary"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        startIcon={<Save />}
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

const TransitionLeft = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});