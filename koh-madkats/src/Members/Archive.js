import React from 'react'

import { Paper, Box, Typography, IconButton, CircularProgress } from '@material-ui/core'
import RestorePage from '@material-ui/icons/RestorePage'

import Navigation from '../Navigation/Navigation'

import gql from 'graphql-tag'
import { useSubscription } from '@apollo/react-hooks'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

const GET_MEMBERS = gql`
subscription GetMembers {
    members(order_by: {ign: asc}, where: {_not: {archived: {_eq: false}}}) {
      id
      ign
      archiveReason
      archiveType
    }
}`

export default function Archive() {
    const { data, loading } = useSubscription(GET_MEMBERS);

    return (
        <>
            <Box display="flex">
                <Navigation />
                <Box m="16px" mt="80px" width="100%">
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        <Typography variant="subtitle2">IGN</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2">Type</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2">Reason</Typography>
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

                                    return (
                                    <TableRow key={line.id}>
                                        <TableCell>{line.ign}</TableCell>
                                        <TableCell>{line.archiveReason}</TableCell>
                                        <TableCell>{line.archiveType}</TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => {
                                                console.log(line)
                                            }}>
                                                <RestorePage />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Box>
        </>
    ) 
}