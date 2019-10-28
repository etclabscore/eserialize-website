import React, { useState, useRef, useEffect } from "react";
import { MuiThemeProvider, AppBar, Toolbar, Typography, IconButton, Tooltip, CssBaseline, Grid, Button, MenuItem, Menu } from "@material-ui/core"; //tslint:disable-line
import useDarkMode from "use-dark-mode";
import Brightness3Icon from "@material-ui/icons/Brightness3";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import CompareArrows from "@material-ui/icons/CompareArrows";
import { lightTheme, darkTheme } from "../themes/theme";
import { useTranslation } from "react-i18next";
import LanguageMenu from "./LanguageMenu";
import SplitPane from "react-split-pane";
import { ControlledEditor } from "@monaco-editor/react";
import { hexToDate, hexToNumber, hexToString, stringToHex, dateToHex, numberToHex } from "@etclabscore/eserialize";
import { SnackBar, ISnackBarNotification, NotificationType } from "../components/SnackBar/SnackBar";
import "./MyApp.css";
import PlayCircle from "@material-ui/icons/PlayCircleFilled";

import { useQueryParam, StringParam } from "use-query-params";

const eserialize = {
  hexToDate,
  hexToNumber,
  hexToString,
  dateToHex,
  stringToHex,
  numberToHex,
};

const MyApp: React.FC = () => {
  const darkMode = useDarkMode();
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [inputOptions, setInputOptions] = useState([
    "string",
    "number",
    "date",
  ]);
  const [outputOptions, setOutputOptions] = useState([
    "hex",
  ]);

  const [selectedInputOption, setSelectedInputOption] = useQueryParam("input", StringParam);
  const [selectedOutputOption, setSelectedOutputOption] = useQueryParam("output", StringParam);
  const [value, setValue] = useQueryParam("value", StringParam);
  const [inputAnchorEl, setInputAnchorEl] = React.useState<null | HTMLElement>(null);
  const [outputAnchorEl, setOutputAnchorEl] = React.useState<null | HTMLElement>(null);
  const [error, setError] = React.useState();
  const [results, setResults] = useState();
  const [notification, setNotification] = useState<ISnackBarNotification | undefined>();
  const valueGetter = useRef();
  const editorRef = useRef();

  function handleEditorDidMount(vg: any, editor: any) {
    valueGetter.current = vg;
    editorRef.current = editor;
    setIsEditorReady(true);
  }

  function handleEditorChange(ev: any, v: string | undefined): string | undefined {
    setValue(v);
    return v;
  }

  useEffect(() => {
    if (isEditorReady) {
      (editorRef as any).current.setValue(value || "");
    }
    // eslint-disable-next-line
  }, [isEditorReady]);

  useEffect(() => {
    if (!selectedInputOption) {
      setSelectedInputOption(inputOptions[0]);
    }
    if (!selectedOutputOption) {
      setSelectedOutputOption(outputOptions[0]);
    }
    if (selectedInputOption && !inputOptions.includes(selectedInputOption)) {
      setInputOptions(outputOptions);
      setOutputOptions(inputOptions);
      return;
    }
    if (selectedOutputOption && !outputOptions.includes(selectedOutputOption)) {
      setInputOptions(outputOptions);
      setOutputOptions(inputOptions);
      return;
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (error) {
      setNotification({
        type: NotificationType.error,
        message: error,
      });
    }
  }, [error]);

  function handleSwap() {
    setInputOptions(outputOptions);
    setOutputOptions(inputOptions);
    setSelectedInputOption(selectedOutputOption);
    setSelectedOutputOption(selectedInputOption);
  }

  function coerce(item: any) {
    switch (selectedInputOption) {
      case "number":
        return parseInt(item, 10);
      case "date":
        return new Date(item);
      default:
        return item;
    }
  }

  function handlePlayClick() {
    if (valueGetter && selectedInputOption && selectedOutputOption) {
      const editorValue = (valueGetter as any).current();
      const funcKey = selectedInputOption.toLowerCase() + "To"
        + selectedOutputOption[0].toUpperCase() + selectedOutputOption.slice(1);
      try {
        setResults((eserialize as any)[funcKey](coerce(editorValue)));
      } catch (e) {
        console.error(e);
        setError(e.message);
      }
    }
  }

  function handleClearButton() {
    setResults(undefined);
  }

  function handleInputMenuItemClick(selectedInputOptionFromClick: string) {
    setSelectedInputOption(selectedInputOptionFromClick);
    setInputAnchorEl(null);
  }

  function handleOutputMenuItemClick(selectedOutputOptionFromClick: string) {
    setSelectedOutputOption(selectedOutputOptionFromClick);
    setOutputAnchorEl(null);
  }

  const handleInputClose = () => {
    setInputAnchorEl(null);
  };

  const handleOutputClose = () => {
    setOutputAnchorEl(null);
  };

  const handleInputClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setInputAnchorEl(event.currentTarget);
  };

  const handleOutputClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOutputAnchorEl(event.currentTarget);
  };

  const { t } = useTranslation();
  const theme = darkMode.value ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={theme}>
      <AppBar position="sticky" color="default" elevation={0}>
        <Toolbar>
          <Grid>
          </Grid>
          <Grid container alignContent="center" alignItems="center" justify="flex-start">
            <Typography variant="h6" style={{ paddingRight: "20px" }}>{t("ΞSerialize")}</Typography>
            <Typography variant="caption" style={{ paddingRight: "5px" }}>
              {t("serialize and deserialize the Ethereum Stack")}
            </Typography>
            <IconButton onClick={handlePlayClick} disabled={!isEditorReady}>
              <PlayCircle />
            </IconButton>
            {<>
              <Tooltip title={t("Input")}>
                <Button onClick={handleInputClick}>{selectedInputOption}</Button>
              </Tooltip>
              <Menu
                id="input-menu"
                anchorEl={inputAnchorEl}
                keepMounted
                open={Boolean(inputAnchorEl)}
                onClose={handleInputClose}
              >
                {Object.values(inputOptions).map((inputOption, i) => (
                  <MenuItem onClick={(event) => handleInputMenuItemClick(inputOption)}>{inputOption}</MenuItem>
                ))}
              </Menu>
            </>
            }
            <IconButton onClick={handleSwap}>
              <CompareArrows />
            </IconButton>
            {<>
              <Tooltip title={t("Output")}>
                <Button onClick={handleOutputClick}>{selectedOutputOption}</Button>
              </Tooltip>
              <Menu
                id="output-menu"
                anchorEl={outputAnchorEl}
                keepMounted
                open={Boolean(outputAnchorEl)}
                onClose={handleOutputClose}
              >
                {Object.values(outputOptions).map((outputOption, i) => (
                  <MenuItem onClick={(event) => handleOutputMenuItemClick(outputOption)}>{outputOption}</MenuItem>
                ))}
              </Menu>
            </>
            }
          </Grid>
          <Grid container alignContent="center" alignItems="center" justify="flex-end">
            <LanguageMenu />
            <Tooltip title={t("Toggle Dark Mode")}>
              <IconButton onClick={darkMode.toggle}>
                {darkMode.value ? <Brightness3Icon /> : <WbSunnyIcon />}
              </IconButton>
            </Tooltip>
          </Grid>
        </Toolbar>
      </AppBar>
      <CssBaseline />
      <SplitPane split="vertical" minSize={100} maxSize={-100} defaultSize={"35%"} style={{ flexGrow: 1 }}>
        <ControlledEditor
          height="93vh"
          onChange={handleEditorChange}
          theme={darkMode.value ? "dark" : "light"}
          editorDidMount={handleEditorDidMount}
        />
        <div>
          <Button
            style={{ position: "absolute", top: "0px", right: "15px", zIndex: 1 }}
            onClick={handleClearButton}>
            Clear
          </Button>
          <Typography style={{ padding: "10px" }}>{results && results.toString()}</Typography>
        </div>
      </SplitPane>
      <SnackBar
        close={() => {
          setNotification({} as ISnackBarNotification);
          setError(undefined);
        }}
        notification={notification as ISnackBarNotification} />
    </MuiThemeProvider>
  );
};

export default MyApp;
