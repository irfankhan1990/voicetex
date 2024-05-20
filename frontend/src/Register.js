import React from "react";
import swal from "sweetalert";
import { TextField, Link } from "@material-ui/core";
import { withRouter } from "./utils";
import { useState } from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
const axios = require("axios");

  const Register=(props)=>{
  const [username , setusername]=useState("");
const [password , setpassword]=useState("");
const [confirm_password , setconfirm_password]=useState("");
const inputEvent = (event)=>{
  const e = event.target.value;
  setusername(e);}
  const inputEvent1 = (event)=>{
    const e = event.target.value;
    setpassword(e);}
    const inputEvent2 = (event)=>{
      const e = event.target.value;
      setconfirm_password(e);}


  const register = () => {

    axios.post('http://localhost:2000/register', {
      username: username,
      password: password,
    }).then((res) => {
      swal({
        text: res.data.title,
        icon: "success",
        type: "success"
      });
      props.navigate("/");
    }).catch((err) => {
      swal({
        text: err.response.data.errorMessage,
        icon: "error",
        type: "error"
      });
    });
  }

    return (
      <div className="bg">

<Box className="boxstyle">
  <Grid container>
    <Grid item xs={12} sm={12} lg={6}>
      <Box className="gbox">
      </Box>
    </Grid>
    <Grid item xs={12} sm={12} lg={6} className="g2box">
    <div>
          <h2>Register</h2>
        </div>

        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            value={username}
            InputProps={{ disableUnderline: true }}
            onChange={inputEvent}
            placeholder="User Name"
            required
          />
          <br /><br />
          <TextField
            id="standard-basicb"
            type="password"
            autoComplete="off"
            name="password"
            InputProps={{ disableUnderline: true }}
            value={password}
            onChange={inputEvent1}
            placeholder="Password"
            required
          />
          <br /><br />
          <TextField
            id="standard-basicd"
            type="password"
            autoComplete="off"
            name="confirm_password"
            InputProps={{ disableUnderline: true }}
            value={confirm_password}
            onChange={inputEvent2}
            placeholder="Confirm Password"
            required
          />
          <br /><br />
          <button
            className="button_style"
            disabled={username === '' && password === ''}
            onClick={register}
          >
            Register
          </button> <br></br>
          <br></br>
          <label style={{fontSize:"20px", color:"#1429A9"}}>Already have an account?</label>
          <Link
            component="button"
            style={{ fontFamily: "inherit", fontSize: "20px" }}
            onClick={() => {
              props.navigate("/");
            }}
          >
            Login
          </Link>
        </div>



    
    </Grid>
  </Grid>
</Box>
   
      </div>
       
    );
  }


export default withRouter(Register);
