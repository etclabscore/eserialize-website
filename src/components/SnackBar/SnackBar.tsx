import {
  Snackbar,
  SnackbarContent,
  WithStyles,
  withStyles,
  Theme,
} from "@material-ui/core";
import React, { Component } from "react";
import classNames from "classnames";
import { isEmpty } from "lodash";
import IconButton from "@material-ui/core/IconButton";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
import ErrorIcon from "@material-ui/icons/Error";
import InfoIcon from "@material-ui/icons/Info";
import WarningIcon from "@material-ui/icons/Warning";
import green from "@material-ui/core/colors/green";
import amber from "@material-ui/core/colors/amber";

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
  debug: InfoIcon,
};

const styleSnackBar = (theme: Theme) => ({
  title: {
    marginLeft: theme.spacing(1),
  },
  close: {
    padding: theme.spacing(2),
  },
  margin: {
    margin: theme.spacing(1),
  },
});

const styleSnackBarContent = (theme: Theme) => ({
  success: {
    color: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    color: theme.palette.primary.dark,
  },
  debug: {
    color: theme.palette.secondary.dark,
  },
  warning: {
    color: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: "flex",
    alignItems: "center",
  },
  close: {
    padding: theme.spacing(2),
  },
  margin: {
    margin: theme.spacing(1),
  },

});

export enum NotificationType {
  Error = "error",
  Warn = "warning",
  Info = "info",
  Success = "success",
  Debug = "debug",
}

interface IProps extends WithStyles<typeof styleSnackBar> {
  notification?: ISnackBarNotification;
  close: any;
}

interface ISnackBarContentProps extends WithStyles<typeof styleSnackBarContent> {
  onClose: any;
  variant: NotificationType;
  className: string;
  message: JSX.Element;
}

export interface ISnackBarNotification {
  type: NotificationType;
  message: string;
}

const SnackBarCntWrapper: React.FC<ISnackBarContentProps> = (props) => {
  const { classes, className, message, onClose, variant, ...other } = props;

  const Icon = variantIcon[variant];
  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
};

const SnackBarContentWrapper = withStyles(styleSnackBarContent)(SnackBarCntWrapper);

const SnackBarWrapper: React.FC<IProps> = (props) => {
  const { classes, notification, close } = props;
  if (isEmpty(notification)) { return null; }
  if (!notification) { return null; }
  return (
    <Snackbar
      open
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}>
      <SnackBarContentWrapper
        onClose={close}
        variant={notification.type}
        message={<span>{notification.message}</span>}
        className={classes.margin}
      />
    </Snackbar>
  );
};

export const SnackBar = withStyles(styleSnackBar)(SnackBarWrapper);
