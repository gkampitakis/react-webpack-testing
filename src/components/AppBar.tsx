import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar as Header, Toolbar, Typography, Button, IconButton, List, Drawer, Divider, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { MenuOutlined as MenuIcon, Inbox as InboxIcon, Mail as MailIcon } from '@material-ui/icons';
import { useHistory } from "react-router-dom";

// NOTE: this only makes a difference in development
// import React from 'react';
// import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
// import Header from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';

const MenuItems1 = [
  { label: 'Inbox', url: 'inbox' },
  { label: 'Starred', url: '/starred' },
  { label: 'Send email', url: '/send-email' },
  { label: 'Drafts', url: '/drafts' },
  { label: 'Image', url: '/image' }
];

const MenuItems2 = [
  { label: 'All mail', url: '/all-email' },
  { label: 'Trash', url: '/trash' },
  { label: 'Spam', url: '/spam' }
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    }
  }),
);

export default function AppBar () {
  const history = useHistory();
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setIsOpen(open);
  };

  const goTo = (path: string) => history.push(path);

  const list = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {MenuItems1.map(({ label, url }, index) => (
          <ListItem button key={label} onClick={() => goTo(url)} >
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {MenuItems2.map(({ label, url }, index) => (
          <ListItem button key={label} onClick={() => goTo(url)}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <Header position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} onClick={toggleDrawer(true)} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Drawer anchor='left' open={isOpen} onClose={toggleDrawer(false)}>
            {list()}
          </Drawer>
          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </Header>
    </div>
  );
}
