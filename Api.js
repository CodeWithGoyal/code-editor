const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const compiler = require("compilex");
const options = { stats: true };
compiler.init(options);

app.use(bodyParser.json());
app.use(
  "/codemirror5-master",
  express.static(path.join(__dirname, "/codemirror5-master"))
);

app.get("/", (req, res) => {
  compiler.flush(()=>{

  });
  res.sendFile(path.join(__dirname, "/index.html"));
});
app.post("/compile", (req, res) => {
  var code = req.body.code;
  var lang = req.body.lang;
  var input = req.body.inputs;

  try {
    if (lang === "Cpp") {
      if (!input) {
        var envData = {
          OS: "windows",
          cmd: "g++",
          options: { timeout: 10000 },
        };
        compiler.compileCPP(envData, code, function (data) {
          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: data.error });
          }
        });
      } else {
        var envData = {
          OS: "windows",
          cmd: "g++",
          options: { timeout: 10000 },
        };
        compiler.compileCPPWithInput(envData, code, input, function (data) {
          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: data.error });
          }
        });
      }
    } else if (lang === "Java") {
      if (!input) {
        var envData = { OS: "windows" };
        compiler.compileJava(envData, code, function (data) {
          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: data.error });
          }
        });
      } else {
        var envData = { OS: "windows" };
        compiler.compileJavaWithInput(envData, code, input, function (data) {
          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: data.error });
          }
        });
      }
    } else if (lang === "Python") {
      if (!input) {
        var envData = { OS: "windows" };
        compiler.compilePython(envData, code, function (data) {
          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: "error" });
          }
        });
      } else {
        var envData = { OS: "windows" };
        compiler.compilePythonWithInput(envData, code, input, function (data) {
          if (data.output) {
            res.send(data);
          } else {
            res.send({ output: "error" });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

const port = process.env.port || 3000;

app.listen(port, () => {
  console.log("server is running on port ", port);
});
