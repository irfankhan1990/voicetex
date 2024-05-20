import React, { useState } from "react";
import swal from "sweetalert";
import { withRouter } from "./utils";
import { Button, TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import LoadingSpinner from "./LoadingSpinner";
import Sidebar from "./PermanentDrawerLeft";
const axios = require("axios");

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setresult] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const inputEvent = (event) => {
    const e = event.target.value;
    setresult(e);
  };

  const handleResult = () => {
    setIsLoading(true);

    var data = {
      requestData: result,
    };
    axios
      .post("http://localhost:2000/processResult", data, {
        headers: {
          result: result,
          token: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setIsLoading(false);
        setIsVisible(!isVisible);
        window.location.reload(false);
      })
      .catch((err) => {
        setIsLoading(false);
        swal({
          text: "Failed to complete request",
          icon: "error",
          type: "error",
        });
      });
  };
  return (
    <div>
      <Sidebar />
      <div>
        <Box className="inputField">
          <div>
            <TextField
              id="standard-basic1"
              type="text"
              autoComplete="off"
              name="result"
              value={result}
              InputProps={{ disableUnderline: true }}
              onChange={inputEvent}
              placeholder="Search for AI generated code"
              required
            />
            <Button
              color="primary"
              variant="contained"
              onClick={handleResult}
              disabled={isLoading}
            >
              Search
            </Button>
            {isLoading ? <LoadingSpinner /> : null}
          </div>
        </Box>
      </div>
    </div>
  );
};

export default withRouter(Dashboard);
