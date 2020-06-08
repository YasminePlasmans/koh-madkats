import React from 'react'

import {Toolbar, Drawer, List, ListItem, ListItemText, ListItemIcon} from '@material-ui/core'
import DashboardIcon from "@material-ui/icons/DashboardRounded"

import Icon from '@mdi/react'
import { mdiAccountGroup } from '@mdi/js';

import { useRouteMatch } from "react-router-dom"

import {
    Link
  } from "react-router-dom";

  import {useStyles} from "./Navigation.style"

export default function Navigation() {
    const classes = useStyles();

    const match = useRouteMatch()

    return (
        <>
            <div className={classes.root}>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                    paper: classes.drawerPaper,
                    }}
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <List> 
                            
                            <Link to="/" className={classes.link}>
                                <ListItem button key="Dashboard" selected={match.url === '/'}>
                                    <ListItemIcon><DashboardIcon /></ListItemIcon>
                                    <ListItemText>
                                        Dashboard
                                    </ListItemText>
                                </ListItem>
                            </Link>
                            <Link to="/members" className={classes.link}>
                                <ListItem button key="Members" selected={match.url === '/members'}>
                                    <ListItemIcon>
                                        <Icon
                                            path={mdiAccountGroup}
                                            title="Members"
                                            size={1}
                                        />
                                    </ListItemIcon>                                    
                                    <ListItemText>
                                        Members
                                    </ListItemText>
                                </ListItem>
                            </Link>
                        </List>
                    </div>
                </Drawer>
            </div>
        </>
    )
}