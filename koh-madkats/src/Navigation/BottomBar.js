import React from 'react'

import { makeStyles } from '@material-ui/styles'
import AddIcon from '@material-ui/icons/Add'
import DashboardIcon from '@material-ui/icons/Dashboard'


import Icon from '@mdi/react'
import { mdiAccountGroup } from '@mdi/js';
import { mdiGlassMugVariant } from '@mdi/js';
import ThumbDown from "@material-ui/icons/ThumbDown"



import {
    Link
  } from "react-router-dom";


import {Toolbar, AppBar,  IconButton, Fab} from '@material-ui/core'

  
export default function BottomBar ({fabAction, active}) {
    const classes = useStylesAppbar()
  
    return (
        <AppBar position="fixed" color="primary" className={classes.appBar}>
            <Toolbar>
                <Link to="/" className={classes.link}>
                    <IconButton color={active === "dashboard" ? "secondary" : "inherit"} aria-label="open drawer">
                        <DashboardIcon />
                    </IconButton>
                </Link>
                <Link to="/members" className={classes.link}>
                    <IconButton color={active === "members"  ? "secondary" : "inherit"}>
                        <Icon
                            path={mdiAccountGroup}
                            title="Members"
                            size={1}
                        />
                    </IconButton>
                </Link>
                <div className={classes.grow} />
                {
                    fabAction && (
                        <>
                            <Fab color="default" aria-label="add" className={classes.fabButton} onClick={fabAction}>
                                <AddIcon />
                            </Fab>
                        </>
                    )
                }
                <Link to="/pints" className={classes.link}>
                    <IconButton color={active === "pints"  ? "secondary" : "inherit"}>
                        <Icon
                        path={mdiGlassMugVariant}
                        title="Pints"
                        size={1}
                        />
                    </IconButton>
                </Link>
                
                <Link to="/dcc" className={classes.link}>
                    <IconButton color={active === "dcc"  ? "secondary" : "inherit"}>
                        <ThumbDown />   
                    </IconButton>
                </Link>
            </Toolbar>
        </AppBar>
    )
}

  
const useStylesAppbar = makeStyles((theme) => ({
    appBar: {
      top: 'auto',
      bottom: 0,
    },
    grow: {
      flexGrow: 1,
    },
    fabButton: {
      position: 'absolute',
      zIndex: 1,
      top: -30,
      left: 0,
      right: 0,
      margin: '0 auto',
    },
    link: {
        color: 'white'
    }
  }))