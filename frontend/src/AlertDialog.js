import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { TextField } from "@mui/material";

export default function AlertDialog(props) {
  const navigation = useNavigate();
  const [open, setOpen] = React.useState(true);
  const [recordName, setRecordName] = React.useState();

  const inputEvent = (event) => {
    setRecordName(event.target.value);
  };
  const handleClose = () => {
    setOpen(false);
    window.location.reload(false);
  };
  const createRecord = () => {
    require("axios")
      .get("http://localhost:2000/createRecord?direc=" + recordName, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.data.statusCode === -1) {
          swal({
            text: res.data.errorMessage,
            icon: "error",
            type: "error",
          });
        } else {
          swal({
            text: "Successfully Created",
            icon: "success",
            type: "success",
          });
          props.action()
          props.updateBlank(recordName)
          setOpen(false);
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
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Enter Blank Record Name
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <TextField
            type="text"
            autoComplete="off"
            name="result"
            value={recordName}
            InputProps={{ disableUnderline: true }}
            onChange={inputEvent}
            placeholder="Enter Record Name"
            required
          />
          <Button variant="contained" onClick={createRecord}>Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
