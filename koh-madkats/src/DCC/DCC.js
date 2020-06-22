import React, {useState} from 'react'
import moment from 'moment'

import { Hidden, Box, Typography, Button, IconButton, Paper, CircularProgress, List, ListItem, ListItemText, Divider} from '@material-ui/core'


import {makeStyles} from "@material-ui/styles"
import Add from '@material-ui/icons/Add'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import Update from '@material-ui/icons/Update'

import BottomBar from '../Navigation/BottomBar'

import NewDay from './NewDay'
import UpdateDay from './UpdateDay'

import {GET_DCC} from './DCC.config'
import { useSubscription } from '@apollo/react-hooks'

export default function DCC() {
    const [open, setOpen] = useState(false)
    const [openUpdate, setOpenUpdate] = useState(false)
    const [selectedDate, setSelectedDate] = useState(moment().format("yyyy-MM-DD"))

    const { data: dcc, loading: dccLoading } = useSubscription(GET_DCC, {
        variables: { date: selectedDate }
      });

      const classes = useStyles()
    return (
        <>
            <Box width="100%">
                <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography variant="h5">DCC</Typography>
                    <Hidden smDown>
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Add />}
                                onClick={() => {
                                    setOpen(true)
                                }}
                            >
                                Register DCC
                            </Button>
                        </Box>
                    </Hidden>
                    <NewDay open={open} setOpen={setOpen} preselectedDate={selectedDate} />
                    <UpdateDay open={openUpdate} setOpen={setOpenUpdate} preselectedDate={selectedDate} />
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
                {   !dccLoading && dcc?.dcc.length > 0 &&
                        <Box pb="16px">
                            <Button
                                variant="outlined"
                                color="primary"
                                startIcon={<Update />}
                                onClick={() => {
                                    setOpenUpdate(true)
                                }}
                            >
                                Update day
                            </Button>
                        </Box>
                }
                <Paper>
                    {   dccLoading ? <Box p="16px" textAlign="center"><CircularProgress /></Box> :
                        dcc?.dcc.length <= 0
                        ? <Box p="16px"><Typography variant="subtitle2">Please log the day to see the overview</Typography></Box>
                        : <List>
                            {dcc?.dcc.map((dccLine, index) => {
                                return (
                                    <React.Fragment key={`${dccLine.id}-header`}>
                                        <ListItem>
                                            <ListItemText primary={dccLine.dccType === "dcc" ? "DCC" : "Sepulcher Mulcher"} />
                                        </ListItem>
                                        {
                                            dccLine.dcc_per_members.length <= 0
                                            ? <Box p="16px"><Typography variant="subtitle2">No one missed</Typography></Box>
                                            : dccLine.dcc_per_members.map(dcc => (
                                                <ListItem key={`${dcc.member.id}-member`} className={classes.nested}>
                                                    <ListItemText primary={dcc.member.ign} />
                                                </ListItem>
                                            ))
                                        }
                                        {
                                            dcc?.dcc.length-1 !== index && <Divider />
                                        }
                                    </React.Fragment>
                                )
                            })
                            }
                        </List>
                    }
                </Paper>
            </Box>

            <Hidden smUp> 
                <BottomBar fabAction={() => setOpen(true)} active="dcc" />
            </Hidden>
        </>
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