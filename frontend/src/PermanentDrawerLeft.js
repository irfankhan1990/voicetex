import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import { useNavigate } from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Button from "@mui/material/Button";
import Textarea from "@mui/joy/Textarea";
import swal from "sweetalert";
import Show from "./Show";
import AlertDialog from "./AlertDialog";
const axios = require("axios");

const drawWidth = 320;

function PermanentDrawerLeft() {
  const navigation = useNavigate();
  const [mobileViewOpen, setMobileViewOpen] = React.useState(false);
  const [text, setText] = React.useState();
  const [code, setCode] = React.useState();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isText, setIsText] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [error, setError] = React.useState("");
  const [document, setDocument] = React.useState();
  const [directories, setDirectories] = React.useState([]);

  useEffect(() => {
   getDir()
  }, []);

  const getDir = () => {
    axios
    .get("http://localhost:2000/userDirectories", {
      headers: {
        token: localStorage.getItem("token"),
      },
    })
    .then((res) => {
      setDirectories(res.data.directories);
    })
    .catch((err) => {
      console.log(err.response.data.errorMessage);
    });
  }

  const updateBlank = (blankText) => {
    setIsVisible(false);
    setText(blankText);
    setIsText(true);
  }

  const handleToggle = () => {
    setMobileViewOpen(!mobileViewOpen);
  };

  const getUpdated = (textValue) => {
    setIsVisible(false);
    setText(textValue);
    setIsText(true);
    axios
      .get("http://localhost:2000/getCode?direc=" + textValue, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setCode(res.data.code);
      })
      .catch((err) => {
        console.log(err.response.data.errorMessage);
      });
  };
  const blankRecord = () => {
    setShowAlert(true);
  };
  const logOut = () => {
    localStorage.setItem("token", null);
    navigation("/");
  };

  const handleCode = (event) => {
    setCode(event.target.value);
  };

  const compile = () => {
    var data = {
      requestData: code,
    };
    axios
      .post("http://localhost:2000/compile?direc=" + text, data, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.statusCode === -1) {
          console.log(res.data.message);
          setIsError(true);
          setIsVisible(false);
          setError(res.data.message);
        } else {
          setDocument(res.data.document);
          setIsVisible(true);
          setIsError(false);
        }
      })
      .catch((err) => {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error",
        });
      });
  };

  const responsiveDrawer = (
    <div style={{ backgroundColor: "#09212E", height: "100%" }}>
      <Divider />
      <Button variant="contained" onClick={logOut}>
        Log Out
      </Button>
      <div style={{ padding: 10 }}>
        <Button variant="contained" onClick={blankRecord}>
          Blank Record
        </Button>
      </div>
      <br />
      <Typography sx={{ textAlign: "center", color: "green", fontSize: 20 }}>
        History
      </Typography>
      <List sx={{ backgroundColor: "#09212E" }}>
        {directories.map((text, index) => (
          <ListItem
            key={text}
            disablePadding
            onClick={(event) => {
              getUpdated(event.target.textContent);
            }}
          >
            <br />
            <ListItemButton sx={{ backgroundColor: "#243447" }}>
              <ListItemText primary={text} sx={{ color: "white" }} />
            </ListItemButton>
            <Divider />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <div>
      <div>
        {showAlert && <AlertDialog action={getDir} updateBlank={updateBlank}/>}
        <Box sx={{ display: "flex" }}>
          <Box
            component="nav"
            sx={{ width: { sm: drawWidth }, flexShrink: { sm: 0 } }}
          >
            <Drawer
              variant="temporary"
              open={mobileViewOpen}
              onClose={handleToggle}
              ModalProps={{
                keepMounted: true,
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawWidth,
                },
              }}
            >
              {responsiveDrawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawWidth,
                },
              }}
              open
            >
              {responsiveDrawer}
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 0.5,
            }}
          >
            {isText && (
              <Textarea
                minRows={22}
                maxRows={22}
                placeholder="Type in here…"
                value={code}
                onChange={handleCode}
              />
            )}
            {isText && (
              <Button variant="contained" onClick={compile}>
                Compile
              </Button>
            )}
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 0.6,
            }}
          >
            {isVisible && <Show documentData={document} />}
            {isError && <Textarea minRows={22} value={error} />}
          </Box>
        </Box>
      </div>
    </div>
  );
}

export default PermanentDrawerLeft;
