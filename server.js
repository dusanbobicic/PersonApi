const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const multer = require("multer");
const path = require("path");

const DATA='persons.json';
const STATUS_OK=200;

app.use(bodyParser.json());
const upload = multer({
  dest: "/src/assets"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

app.listen(3000, () => {
    console.log('Server started!')
  });

  app.route('/api/persons').get((req, res) => {
    let rawdata = fs.readFileSync(DATA);  
    let persons = JSON.parse(rawdata);  
    res.status(STATUS_OK).send(persons);
  });

  app.route('/api/getbyid').post((req, res) => {
    let value=req.body;
    console.log(value.id);
    let rawdata = fs.readFileSync(DATA);

    let persons = JSON.parse(rawdata);  
    for(let per in persons.persons){
      if(persons.persons[per].id==value.id){
        res.status(STATUS_OK).send(persons.persons[per]);    
      }
    }

  });
  app.post(
    "/api/upload",
    upload.single("image" /* name attribute of <file> element in your form */),
    (req, res) => {
      const tempPath = req.file.path;
      const targetPath = path.join(__dirname, "../REALMED/src/assets/"+req.file.originalname);
  
      if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
        fs.rename(tempPath, targetPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(200)
            .contentType("application/json")
            .end(JSON.stringify({name:req.file.originalname}));
        });
      } else {
        fs.unlink(tempPath, err => {
          if (err) return handleError(err, res);
  
          res
            .status(403)
            .contentType("text/plain")
            .end("Only .jpg files are allowed!");
        });
      }
    });

 /* app.route('/api/upload').post((req, res) => {
    let value=req.body;
    console.log(value.id);
    let rawdata = fs.readFileSync(DATA);

    let persons = JSON.parse(rawdata);  
    for(let per in persons.persons){
      if(persons.persons[per].id==value.id){
        res.status(STATUS_OK).send(persons.persons[per]);    
      }
    }


  });*/
  app.route('/api/addperson').post((req,res)=>{
    let value= req.body;
    console.log(value);
    let rawdata = fs.readFileSync(DATA);
    let persons = JSON.parse(rawdata);
    let lastID=persons.persons.length;
    value.id=lastID;
    persons.persons.push(value);
    fs.writeFile(DATA, JSON.stringify(persons,null,1), 'utf8',err=>{
      console.log(err);
      res.status(401).send();
    } );
    res.status(STATUS_OK).send(JSON.stringify(value));
  });
