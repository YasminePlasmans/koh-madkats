import React, {useState} from 'react'

import { Paper, Box, Typography, Button, IconButton, CircularProgress, Hidden } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import Edit from '@material-ui/icons/Edit'
import Archive from '@material-ui/icons/Archive'

import AddMember from './AddMember'
import RemoveMember from './RemoveMember'
import BottomBar from '../Navigation/BottomBar'

import gql from 'graphql-tag'
import { useSubscription } from '@apollo/react-hooks'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

import {NavLink} from "react-router-dom"

import {useStyles} from "./Members.style"

const GET_MEMBERS = gql`
subscription GetMembers {
    members(order_by: {ign: asc}, where: {_not: {archived: {_eq: true}}}) {
      id
      ign
      might
      rank
    }
}`

export default function Members() {
    const { data, loading } = useSubscription(GET_MEMBERS);

    const [open, setOpen] = useState(false)
    const [removeOpen, setRemoveOpen] = useState(false)
    const [defaultValues, setDefaultValues] = useState({})
    const [removeMember, setRemoveMember] = useState()

    const classes = useStyles();

    const handleRemoveMember = (member) => {
        setRemoveMember(member)
        setRemoveOpen(true)
    }

    return (
        <>
            <Box width="100%">
                <Box display="flex" justifyContent="space-between" mb="16px" width="100%">
                    <Typography variant="h5">Members {data?.members.length}/50</Typography>
                    
                    <Hidden smDown> 
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Add />}
                            onClick={() => {
                                setDefaultValues({})
                                setOpen(true)
                            }}
                        >
                            Add member
                        </Button>
                    </Hidden>
                    <AddMember open={open} setOpen={setOpen} defaultValues={defaultValues} />
                    <RemoveMember open={removeOpen} setOpen={setRemoveOpen} member={removeMember} />
                </Box>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <Typography variant="subtitle2">IGN</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Might</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="subtitle2">Rank</Typography>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { loading
                            ?   <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            : data?.members?.map(line => {
                                const might = line.might.toLocaleString(undefined, {maximumFractionDigits:2})

                                return (
                                <TableRow key={line.id}>
                                    <TableCell>{line.ign}</TableCell>
                                    <TableCell>{might}{'\u00A0'}m</TableCell>
                                    <TableCell>{line.rank}</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => {
                                            setDefaultValues(line)
                                            setOpen(true)
                                        }}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleRemoveMember(line)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box display="flex" justifyContent="flex-end" mt="16px" width="100%">
                    <NavLink to="/members/archive" className={classes.link}>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Archive />}
                        >
                            Archive
                        </Button>
                    </NavLink>
                </Box>
            </Box>
            
            <Hidden smUp> 
                <BottomBar fabAction={() => setOpen(true)} active="members" />
            </Hidden>
        </>
    ) 
}