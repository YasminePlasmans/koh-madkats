import React from 'react'

import { Hidden } from '@material-ui/core'

import BottomBar from '../Navigation/BottomBar'

export default function Dashboard() {
    console.log("test")
    return (
        <>
            <Hidden smUp> 
                <BottomBar active="dashboard" />
            </Hidden>
        </>
    ) 
}