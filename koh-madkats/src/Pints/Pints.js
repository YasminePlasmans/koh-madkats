import React, {useState} from 'react'

import moment from 'moment'

import {
    Box,
    Button,
    Typography,
    Hidden,
    IconButton,
    List,
    Collapse,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Paper,
    Checkbox,
    CircularProgress
} from "@material-ui/core"

import {makeStyles} from "@material-ui/styles"
import green from "@material-ui/core/colors/green"

import Add from "@material-ui/icons/Add"
import DoneAll from "@material-ui/icons/DoneAll"
import Close from "@material-ui/icons/Close"
import ChevronRight from "@material-ui/icons/ChevronRight"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import Check from "@material-ui/icons/Check"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"

import Icon from '@mdi/react'

import { mdiCheckBoxMultipleOutline } from '@mdi/js'
import { mdiCheckBoxOutline } from '@mdi/js'

import { mdiCheckboxBlankOutline } from '@mdi/js';

import NewDay from './NewDay'
import BottomBar from '../Navigation/BottomBar'

import {GET_PINTS, QUERY_PINTS, UPDATE_PINTS_BY_MEMBER} from './Pints.config'
import { useSubscription, useMutation } from '@apollo/react-hooks'

export default function Pints() {
    const [open, setOpen] = useState(false)
    const [openPints, setOpenPints] = useState({})
    const [editPints, setEditPints] = useState({})

    const [selectedDate, setSelectedDate] = useState(moment().format("yyyy-MM-DD"))

    const { data, loading } = useSubscription(GET_PINTS, {
        variables: { date: selectedDate }
      });

    const { data: pints, loading: pintsLoading } = useSubscription(QUERY_PINTS, {
        variables: { date: selectedDate }
      });

    const addedPintTypes = {
        pint: !!pints?.pints?.find(pint => pint.pintType === "pint"),
        raidPint: !!pints?.pints?.find(pint => pint.pintType === "raidPint")
    }

    const [updatePintsByMember] = useMutation(UPDATE_PINTS_BY_MEMBER);
    const updatePints = data => {
        
        if (data.pint.id) {
            updatePintsByMember({
                variables: {
                    id: data.pint.id,
                    bought: data.pint.value
                }
            })
        }

        if (data.raidPint.id) {
            updatePintsByMember({
                variables: {
                    id: data.raidPint.id,
                    bought: data.raidPint.value
                }
            })
        }

        setEditPints({
            ...editPints,
            [data.memberID]: false
        })
    }

    const classes = useStyles()

    return (
        <Box width="100%">
            <Box display="flex" justifyContent="space-between" width="100%">
                <Typography variant="h5">Pints</Typography>
                <Hidden smDown> 
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add />}preselectedDate
                        onClick={() => {
                            setOpen(true)
                        }}
                    >
                        Register pints
                    </Button>
                </Hidden>
                <NewDay open={open} setOpen={setOpen} preselectedDate={selectedDate} /> 
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb="16px" width="100%">
                <IconButton onClick={() => {
                    setSelectedDate(moment(selectedDate).subtract(1, 'day').format("yyyy-MM-DD"))
                }}>
                    <ChevronLeft />
                </IconButton>
                <Typography variant="h6" align="center">
                    {

                        moment(selectedDate).calendar(null, {
                            sameDay: '[Today]',
                            nextDay: '[Tomorrow]',
                            nextWeek: 'dddd',
                            lastDay: '[Yesterday]',
                            lastWeek: '[Last] dddd',
                            sameElse: 'MMMM Do yyyy'
                        })
                    }
                </Typography>
                <IconButton
                    onClick={() => {
                        setSelectedDate(moment(selectedDate).add(1, 'day').format("yyyy-MM-DD"))
                    }}
                    disabled={moment().isSame(moment(selectedDate), "day")}>
                    <ChevronRight />
                </IconButton>
            </Box>

            <Paper>
                {   loading || pintsLoading ? <Box p="16px" textAlign="center"><CircularProgress /></Box> :
                    pints?.pints.length <= 0
                    ? <Box p="16px"><Typography variant="subtitle2">Please log the day to see the overview</Typography></Box>
                    : <List>
                        {
                            data?.members?.map(member => {
                                const pint = member.pint_per_members.find(pint => pint.pint.pintType === "pint")
                                const pintBought = !!(pint && pint.amountBought > 0)
                                const raidPint = member.pint_per_members.find(pint => pint.pint.pintType === "raidPint")
                                const raidPintBought = !!(raidPint && raidPint.amountBought === 1)
                                const raidPintBoughtTwice = !!(raidPint && raidPint.amountBought === 2)
                                const anyBought = pintBought || raidPintBought
                                const allBought = pintBought && (raidPintBought || raidPintBoughtTwice)

                                return (
                                    <React.Fragment key={member.id}>
                                        <ListItem
                                            button
                                            onClick={() => {
                                                setOpenPints({
                                                    ...openPints,
                                                    [member.id]: !openPints[member.id]
                                                })
                                            }}
                                            key={`${member.id}-header`}
                                        >
                                            <ListItemIcon>
                                                {
                                                    allBought
                                                    ? <DoneAll style={{color: green[500]}} />
                                                    : anyBought
                                                        ? <Check style={{color: pintBought ? green[500] : 'default'}} />
                                                        : <Close />
                                                }

                                            </ListItemIcon>
                                            <ListItemText primary={member.ign} />
                                            {openPints[member.id] ? <ExpandLess /> : <ExpandMore />}
                                        </ListItem>
                                        <Divider key={`${member.id}-divider`} />
                                        <Collapse in={openPints[member.id]} timeout="auto" unmountOnExit key={`${member.id}-body`}>
                                            <List component="div" disablePadding>
                                                {
                                                    addedPintTypes.pint
                                                    ? <ListItem className={classes.nested}>
                                                        <ListItemIcon>
                                                        <Checkbox
                                                            size="small"
                                                            color="primary"
                                                            edge="start"
                                                            checked={pintBought > 0}
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
                                                        <ListItemText primary="Pint"  primaryTypographyProps={{color: "textSecondary"}}/>
                                                    </ListItem>
                                                    : null
                                                }

                                                {
                                                    addedPintTypes.raidPint
                                                    ? <ListItem className={classes.nested}>
                                                        <ListItemIcon>
                                                        <Checkbox
                                                            size="small"
                                                            color="primary"
                                                            edge="start"
                                                            checked={!!(raidPint?.amountBought > 0)}
                                                            indeterminate={raidPint?.amountBought === 1}
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
                                                        <ListItemText primary="Raid pint"  primaryTypographyProps={{color: "textSecondary"}}/>
                                                    </ListItem>
                                                    : null
                                                }

                                                <ListItem className={classes.nested}>
                                                    <Button
                                                        color="primary"
                                                        onClick={() => {
                                                            console.log("cancel")
                                                        }
                                                    }
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        color="primary"
                                                        variant="outlined"
                                                        onClick={
                                                        () => {
                                                            updatePints({
                                                                memberID: member.id,
                                                                pint: {
                                                                    value: 0,
                                                                    id: pint?.id
                                                                },
                                                                raidPint: {
                                                                    value: 0,
                                                                    id: raidPint?.id
                                                                }
                                                            })
                                                        }
                                                    }
                                                    >
                                                        Save
                                                    </Button>
                                                </ListItem>
                                            </List>
                                        </Collapse>
                                    </React.Fragment>
                                )
                            })
                        }
                    </List>
                }

            </Paper>
            <Hidden smUp>
                <BottomBar fabAction={() => setOpen(true)} active="pints" />
            </Hidden>
        </Box>
    )
}

export const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    nested: {
      paddingLeft: theme.spacing(4),
    },
  }));