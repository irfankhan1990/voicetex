import React from "react";
import swal from "sweetalert";
import {TextField, Link } from "@material-ui/core";
import { withRouter } from "./utils";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { useState } from "react";
const axios = require("axios");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);


const Login=(props)=>{
const [username , setusername]=useState("");
const [password , setpassword]=useState("");

const inputEvent = (event)=>{
  const e = event.target.value;
  setusername(e);}
  const inputEvent1 = (event)=>{
    const e = event.target.value;
    setpassword(e);}


  const login = () => {
    const pwd = bcrypt.hashSync(password, salt);

    axios.post('http://localhost:2000/login', {
      username: username,
      password: pwd,
    }).then((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user_id', res.data.id);
      props.navigate("/dashboard");
    }).catch((err) => {
      if (err.response && err.response.data && err.response.data.errorMessage) {
        swal({
          text: err.response.data.errorMessage,
          icon: "error",
          type: "error"
        });
      }
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
          <h2>Sign In</h2>
        </div>
        <div>
          <TextField
            id="standard-basic"
            type="text"
            autoComplete="off"
            name="username"
            InputProps={{ disableUnderline: true }}
            value={username}
            onChange={inputEvent}
            placeholder="UserName"
            required
          />
          <br /><br />
          <TextField
            id="standard-basicb"
            type="password"
            autoComplete="off"
            InputProps={{ disableUnderline: true }}
            name="password"
            value={password}
            onChange={inputEvent1}
            placeholder="Password"
            required
          />
          <br /><br />
          
          <button 
          className="button_style" 
          disabled={username === '' && password === ''}
          onClick={login}  >
          Login
</button>
          
           <br></br>
           <br></br>
           <label style={{fontSize:"20px", color:"#1429A9"}}>Not registered yet?</label>
          <Link
            component="button"
            style={{ fontFamily: "inherit", fontSize: "20px" }}
            onClick={() => {
              props.navigate("/register");
            }}
          >
            Create an account
          </Link>
        </div>
    
    </Grid>
  </Grid>
</Box>
   
      </div>
    );
  }


export default withRouter(Login);