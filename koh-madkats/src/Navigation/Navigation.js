import React from 'react'

import {List, ListItem, ListItemText, ListItemIcon, Hidden, Drawer, Toolbar} from '@material-ui/core'
import DashboardIcon from "@material-ui/icons/DashboardRounded"

import Icon from '@mdi/react'
import { mdiAccountGroup } from '@mdi/js';
import { mdiGlassMugVariant } from '@mdi/js';

import { useRouteMatch } from "react-router-dom"

import {
    Link
  } from "react-router-dom";

  import {useStyles} from "./Navigation.style"

export default function Navigation() {
    const classes = useStyles();

    return (
        <>
            <Hidden xsDown>
                <Drawer
                    anchor="left"
                    className={classes.drawer}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    variant="permanent"
                >
                    <Toolbar />
                    <div className={classes.drawerContainer}>
                        <NavList />
                    </div>
                </Drawer>
            </Hidden>
        </>
    )
}

function NavList() {
    const classes = useStyles();

    const match = useRouteMatch()
    return (
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
                <ListItem button key="Members" selected={match.url === '/members' || match.url === '/members/archive'}>
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
            <Link to="/pints" className={classes.link}>
                <ListItem button key="Pints" selected={match.url === '/pints'}>
                    <ListItemIcon>
                        <Icon
                            path={mdiGlassMugVariant}
                            title="Pints"
                            size={1}
                        />
                    </ListItemIcon>
                    <ListItemText>
                        Pints
                    </ListItemText>
                </ListItem>
            </Link>
        </List>
    )
}