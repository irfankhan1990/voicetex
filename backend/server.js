var express = require("express");
var app = express();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var cors = require("cors");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://0.0.0.0/voicetex");
var user = require("./model/user.js");
const latex = require("node-latex");
const config = require("dotenv");
const fetch = require("node-fetch");
const key = "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";
const { createReadStream, createWriteStream } = require("fs");
var fs = require("fs");
const { readdirSync } = require("fs");
const { join } = require("path");
let chatHistory = [];
app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use("/", (req, res, next) => {
  try {
    if (req.path == "/login" || req.path == "/register" || req.path == "/") {
      next();
    } else {
      jwt.verify(req.headers.token, "shhhhh11111", function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded.user;
          next();
        } else {
          return res.status(401).json({
            errorMessage: "User unauthorized!",
            status: false,
          });
        }
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong! " + e,
      status: false,
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: "Apis",
  });
});

function listDirec(pth) {
  return readdirSync(pth, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

app.get("/getCode", (req, res) => {
  const direc =
    __dirname + "\\files" + "\\" + req.user + "\\" + req.query.direc;
  if (fs.existsSync(direc)) {
    if (fs.existsSync(direc + "\\input.tex")) {
      fs.readFile(direc + "\\input.tex", "utf8", (err, data) => {
        if (err) {
          console.error(err);
          res.status(200).json({
            code: "Iternal server error",
          });
          return;
        }
        res.status(200).json({
          code: data,
        });
      });
    }else{
      res.status(200).json({
        code: "",
      });
    }
  } else {
    res.status(200).json({
      statusCode: -1,
      code: "No record found according to request",
    });
  }
});

app.get("/userDirectories", (req, res) => {
  const direc = __dirname + "\\files" + "\\" + req.user;
  if (fs.existsSync(direc)) {
    const dirResult = listDirec(direc);
    res.status(200).json({
      directories: dirResult,
    });
  } else {
    res.status(200).json({
      directories: [],
    });
  }
});

/* login api */
app.post("/login", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {
          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {
            res.status(400).json({
              errorMessage: "Username or password is incorrect!",
              status: false,
            });
          }
        } else {
          res.status(400).json({
            errorMessage: "Username or password is incorrect!",
            status: false,
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

/* register api */
app.post("/register", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length == 0) {
          let User = new user({
            username: req.body.username,
            password: req.body.password,
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false,
              });
            } else {
              res.status(200).json({
                status: true,
                title: "Registered Successfully.",
              });
            }
          });
        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false,
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: "Add proper parameter first!",
        status: false,
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});
async function toBase64(filePath) {
  try {
    const result = await fs.readFile(filePath, {
      encoding: "base64",
    });

    return result;
  } catch (err) {
    console.log(err);
  }
}
app.get("/createRecord", async (req, res) => {
  try {
    const direc =
      __dirname + "\\files" + "\\" + req.user + "\\" + req.query.direc;
    console.log("Direc: " + direc);
    if (!fs.existsSync(__dirname + "\\files")) {
      fs.mkdirSync(__dirname + "\\files");
    }
    if (!fs.existsSync(__dirname + "\\files\\" + req.user)) {
      fs.mkdirSync(__dirname + "\\files\\" + req.user);
    }
    if (!fs.existsSync(direc)) {
      fs.mkdirSync(direc);
      res.status(200).json({
        statusCode: 0,
        errorMessage: "Name already exists",
      });
    } else {
      res.status(200).json({
        statusCode: -1,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      statusCode: -1,
      errorMessage: e.toString(),
    });
  }
});
app.post("/getCompiledData", async (req, res) => {
  try {
    const direc =
      __dirname + "\\files" + "\\" + req.user + "\\" + req.query.direc;
    console.log("Direc: " + direc + "\\output.pdf");
    // var readFile = fs.readFileSync(direc + "\\output.pdf", {
    //   encoding: "base64",
    // });
    const readFile = await require("fs/promises").readFile(
      direc + "\\output.pdf",
      {
        encoding: "base64",
      }
    );
    console.log("File: " + readFile);
    res.status(200).json({
      document: readFile,
    });
    // const readFile = Buffer.from(
    //   fs.readFileSync(direc + "\\output.pdf")
    // ).toString("base64");
  } catch (e) {
    console.log(e);
    res.status(200).json({
      statusCode: -1,
      errorMessage: e.toString(),
    });
  }
});

app.post("/compile", async (req, res) => {
  try {
    const direc =
      __dirname + "\\files" + "\\" + req.user + "\\" + req.query.direc;
      fs.writeFileSync(direc + "\\input.tex", req.body.requestData);
      const node_latex = require("node-latex");

      const pdf = node_latex(createReadStream(join(direc, "input.tex")));
      pdf.pipe(createWriteStream(join(direc, "output.pdf")));
      pdf.on("error", (err) => {
        console.log(err);
        res.status(200).json({
          statusCode: -1,
          message: err.toString(),
        });
      });

      pdf.on("finish", (err) => {
        const readFile = fs.readFileSync(direc + "\\output.pdf", {
          encoding: "base64",
        });
        res.status(200).json({
          document: readFile,
        });
      });
  } catch (e) {
    console.log(e);
    res.status(200).json({
      errorMessage: e.toString(),
    });
  }
});
app.post("/processResult", async (req, res) => {
  try {
    const userPrompt = req.body.requestData;
    const requestMessages = [
      ...chatHistory,
      {
        role: "user",
        content: userPrompt,
      },
    ];
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: requestMessages,
        max_tokens: 1000,
      }),
    };
    await fetch("https://api.openai.com/v1/chat/completions", options)
      .then((response) => response.json())
      .then((data) => {
        const responseMessage = data.choices[0].message;
        const message = responseMessage.content;
        console.log(message);
        if (!message.includes("documentclass")) {
          res.status(400).json({
            document: "",
          });
        } else {
          var result = message.substring(
            message.indexOf("documentclass") - 1,
            message.lastIndexOf("end{document}")
          );
          result = result + "end{document}";
          if (!fs.existsSync(__dirname + "\\files")) {
            fs.mkdirSync(__dirname + "\\files");
          }
          if (!fs.existsSync(__dirname + "\\files" + "\\" + req.user)) {
            fs.mkdirSync(__dirname + "\\files" + "\\" + req.user);
          }
          var dirName = "";
          if (req.body.requestData.length > 50) {
            dirName = req.body.requestData.substring(
              0,
              req.body.requestData.length / 2
            );
          } else {
            dirName = req.body.requestData;
          }
          var dir = __dirname + "\\files" + "\\" + req.user + "\\" + dirName;
          // .replaceAll(/ /g, "_");
          // +"-" +
          // Math.floor(100000 + Math.random() * 900000);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            fs.writeFileSync(dir + "\\input.tex", result);
            fs.writeFileSync(dir + "\\output.pdf", "");
          }
          const input = createReadStream(join(dir, "input.tex"));
          const output = createWriteStream(join(dir, "output.pdf"));
          latex(input).pipe(output);
          const newMessages = [
            ...requestMessages,
            {
              role: responseMessage.role,
              content: responseMessage.content,
            },
          ];

          // updating the chat history
          chatHistory = newMessages;
          res.status(200).json({
            status: true,
            document: fs.readFileSync(dir + "\\output.pdf", {
              encoding: "base64",
            }),
          });
        }
      })
      .catch((error) => console.error(error));
  } catch (e) {
    console.log(e);
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign(
    { user: data.username, id: data._id },
    "shhhhh11111",
    { expiresIn: "1d" },
    (err, token) => {
      if (err) {
        res.status(400).json({
          status: false,
          errorMessage: err,
        });
      } else {
        res.json({
          message: "Login Successfully.",
          token: token,
          status: true,
        });
      }
    }
  );
}

app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});
