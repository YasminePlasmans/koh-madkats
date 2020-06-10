import React, {useState, useEffect} from 'react'
import moment from 'moment'

import {
    Box,
    Button,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableContainer,
    Paper,
    TableRow,
    TableCell,
    CircularProgress, 
    IconButton,
    Collapse,
    FormGroup,
    Checkbox,
    FormControlLabel
} from "@material-ui/core"

import Add from "@material-ui/icons/Add"
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp"

import NewDay from './NewDay'

import {GET_MEMBERS, GET_PINTS, pintTypes} from './Pints.config'
import { useSubscription, useQuery } from '@apollo/react-hooks'


export default function Pints() {
    const [open, setOpen] = useState(false)
    const [openPints, setOpenPints] = useState()

    const { data, loading } = useSubscription(GET_PINTS);
    const { data: members } = useQuery(GET_MEMBERS)

    const pints = data?.pints

    const updatePintForMember = data => {
        console.log(data)
    }

    useEffect(() => {
        let pintsOpen = {}
    
        pints && pints.forEach((pint, index) => pintsOpen[pint.id] = index === 0)

        setOpenPints(pintsOpen)
    }, [])

    return (
        <Box m="16px" mt="80px" width="100%">
            <Box display="flex" justifyContent="space-between" mb="16px" width="100%">
                <Typography variant="h5">Pints</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={() => {
                        setOpen(true)
                    }}
                >
                    Register pints
                </Button>
                <NewDay open={open} setOpen={setOpen} /> 
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell component="th"></TableCell>
                            <TableCell component="th">Date</TableCell>
                            <TableCell component="th">Pint Type</TableCell>
                            <TableCell component="th">Completion rate</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { loading
                            ?   <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            : 
                            data?.pints?.map(line => {
                                const date = moment(line.date)
                                const type = pintTypes.find(type => type.value === line.pintType).label
                                return (
                                    <>
                                        <TableRow key={`${line.id}-header`}>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="expand row"
                                                    size="small"
                                                    onClick={() => {
                                                        setOpenPints({
                                                            ...openPints,
                                                            [line.id]: !openPints[line.id]
                                                        })
                                                    }}
                                                >
                                                    {openPints[line.id] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>{date.format("MMMM Do")}</TableCell>
                                            <TableCell>{type}</TableCell>
                                            <TableCell>{line.membersFinished} / {line.membersAmount}</TableCell>
                                        </TableRow>
                                        <TableRow key={`${line.id}-members`}>
                                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                                <Collapse in={openPints[line.id]} timeout="auto" unmountOnExit>
                                                    <Box margin={1}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Members
                                                        </Typography>
                                                        <FormGroup row>
                                                            {
                                                                members?.members?.map(member => {
                                                                    const checked = line.pint_per_members.find(pintMember => member.id === pintMember.member.id)
                                                                    return (
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Checkbox
                                                                                    checked={!!checked}
                                                                                    onChange={() => updatePintForMember({checked: !checked, pintId: line.id, memberId: member.id})}
                                                                                    name="checkedB"
                                                                                    color="primary"
                                                                                />
                                                                            }
                                                                            label={member.ign}
                                                                        />
                                                                    )
                                                                })
                                                            }
                                                        </FormGroup>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                )
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
}