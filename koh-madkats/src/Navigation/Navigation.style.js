import { makeStyles } from '@material-ui/styles'

const drawerWidth = 240;

export const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: 1206,
    },
    content: {
        flexGrow: 1
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    link: {
        color: theme.palette.primary.main,
        textDecoration: 'none'
    }
}));
