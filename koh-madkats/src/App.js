import React, {useState} from 'react'
import './App.css'
import { theme } from './theme'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"

import Dashboard from './Dashboard/Dashboard'
import Members from './Members/Members'
import Archive from './Members/Archive'

import Pints from './Pints/Pints'

import Layout from './Navigation/Layout'

import { ThemeProvider } from '@material-ui/styles'

import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloProvider } from '@apollo/react-hooks'

import { useAuth0 } from "./react-auth0-spa"

import { makeStyles } from '@material-ui/styles'

import ExitToApp from '@material-ui/icons/ExitToApp'
import Person from '@material-ui/icons/Person'
import Menu from '@material-ui/icons/Menu'

import {Toolbar, AppBar, Box, Typography, IconButton, Tooltip, Hidden} from '@material-ui/core'

import { createBrowserHistory } from "history";

 const createApolloClient = (authToken) => {
  return new ApolloClient({
    link: new WebSocketLink({
      uri: 'wss://koh-madkats.herokuapp.com/v1/graphql',
      headers: {
        Authorization: `Bearer ${authToken}`
      } 
    }),
    cache: new InMemoryCache()
  });
 };

const App = ({ idToken }) => {
  const classes = useStyles();
  const client = createApolloClient(idToken)

  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  
  const history = createBrowserHistory()

  const [navigationOpen, setNavigationOpen] = useState(false)

  return (
    <Router history={history}>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <Box display="flex" flexGrow={1} alignItems="center">
                    <Hidden smUp>
                      <IconButton onClick={() => setNavigationOpen(!navigationOpen)}>
                          <Menu style={{ color: 'white' }} />
                      </IconButton>
                    </Hidden>
                    <Box display="flex" flexGrow={1}>
                        <Typography variant="h6">
                            The Mad Kats
                        </Typography>
                    </Box>
                    <Box>
                        {isAuthenticated && (
                        <Tooltip title="Logout" arrow>
                            <IconButton onClick={logout}>
                                <ExitToApp style={{ color: 'white' }} />
                            </IconButton>
                        </Tooltip> 
                        )}

                        {!isAuthenticated && (
                        <Tooltip title="Login" arrow>
                            <IconButton onClick={loginWithRedirect}>
                                <Person style={{ color: 'white' }} />
                            </IconButton>
                        </Tooltip>
                        )}
                    </Box>
                </Box>
            </Toolbar>
          </AppBar>
          <Switch>
                <Route path="/members" exact>
                  <Layout navigationOpen={navigationOpen} setOpen={setNavigationOpen}>
                    <Members />
                  </Layout>
                </Route>

                <Route path="/members/archive">
                  <Layout navigationOpen={navigationOpen} setOpen={setNavigationOpen}>
                    <Archive />
                  </Layout>
                </Route>

                <Route path="/pints">
                  <Layout navigationOpen={navigationOpen} setOpen={setNavigationOpen}>
                    <Pints />
                  </Layout>
                </Route>

                <Route path="/" exact>
                  <Layout navigationOpen={navigationOpen} setOpen={setNavigationOpen}>
                    <Dashboard />
                  </Layout>
                </Route>
          </Switch>
        </ThemeProvider>
      </ApolloProvider>
    </Router>
  )
}

export default App

export const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: 1206,
    },
    content: {
        flexGrow: 1
    }
}));