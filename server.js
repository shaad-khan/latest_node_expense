const express = require('express');
const multer = require('multer');
const uuidv1 = require('uuid/v1');
const ftp = require("basic-ftp");
//var PDFImage = require("pdf-image").PDFImage;
const PDFDocument = require('pdfkit');
//const fs = require("fs")
 
const fs=require('fs');
//const vision = require('@google-cloud/vision');
var foursquare = (require('foursquarevenues'))('3RYXQ44WNNKEHX2NVL43MYHRZJT5H5CQLFHCL2VRHYU3WLUD', 'XGBRLMDU0IU2Z1ZSWHLRAFVM1D5Q0LRA4QA2ROQSFOWHFLYN');
//var MongoClient = require('mongodb').MongoClient;
const nodemailer = require('nodemailer');
//var async = require("async");
//const waitUntil = require('async-wait-until');
//var url = "mongodb://localhost:27017/";
//const client = new vision.ImageAnnotatorClient();
const path = require("path");
//var MongoClient = require('mongodb').MongoClient;
//var url = "mongodb://localhost:27017/";
var dbo='';
//var ObjectId = require('mongodb').ObjectID;
var task=require('./model/csconnect_auth');
var bcrypt = require('bcrypt');
/*const upload = multer({
  dest: 'uploads/' // this saves your file into a directory called "uploads"
}); */
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
app.use(express.static("uploads"));

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: false }));
 app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/*var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname,'./uploads/'))
  },
  filename: function (req, file, cb) {
    //console.log()
    cb(null, file.originalname);
  // cb(null, file.fieldname)
  }
})

var upload = multer({ storage: storage }).single("fileName");*/
app.post('/upload', function (req, res) {
 

task.getNextId('expensesheetlinerecord',(err,row)=>{

console.log(JSON.stringify(row));
console.log(row[0].Id+1);
var x=row[0].Id+1;
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        console.log("ceid : "+req.body.ceid);
        
        var dir=`./uploads/${req.body.ceid}`;
        if (!fs.existsSync(dir)){
   fs.mkdirSync(dir)
        }
   var dir=`./uploads/${req.body.ceid}/${req.body.sheetid}`;
   if (!fs.existsSync(dir)){
   fs.mkdirSync(dir)
   }
 } catch (err) {
   if (err.code !== 'EEXIST') throw err
 }
      cb(null, path.resolve(process.cwd()+`/uploads/${req.body.ceid}/${req.body.sheetid}/`))
    },
    filename: function (req, file, cb) {

      cb(null,x+".png");
    // cb(null, file.fieldname)
    }
  })


  var upload = multer({ storage: storage }).single("fileName");


















  upload(req, res, function (err) {

    if (err) {

      console.log(err);
      return res.end("Error");
    }
    else{

  console.log("value of x :"+x);

  doc = new PDFDocument;
  doc.pipe(fs.createWriteStream(process.cwd()+`/uploads/${req.body.ceid}/${req.body.sheetid}/${x}.pdf`))

  doc.image(process.cwd()+`/uploads/${req.body.ceid}/${req.body.sheetid}/${x}.png`, {
    fit: [500, 400],
    align: 'center',
    valign: 'center'
 });
doc.end();
/*-------------------------------------------------------------*/
example()
 
async function example() {



    const client = new ftp.Client()
    var currentPath = process.cwd();
    client.ftp.verbose = true
    try {
        await client.access({
          host: "waws-prod-pn1-001.ftp.azurewebsites.windows.net",
          user: "$CSConnectWebApp-Test",
          password: "pQ4AdYmxCGpou4Hh6PSqBqEKD1dpjcuCqLoFD3brCK2nReBjwi94R3GkuTLi",
          secure: false,
          secureOptions: { rejectUnauthorized: false }
        })
        //console.log(await client.list())
        await client.ensureDir(`/site/wwwroot/CSIntranet/Expense/ExpenseFiles/${req.body.ceid}`);

        await client.uploadDir(`${currentPath}\\uploads\\${req.body.ceid}`);
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}


/*------------------------------------------------------------*/
    console.log("filename : "+req.file.filename);
  console.log(JSON.stringify(req.body));
 //if(res.body.multi)
  /*  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      dbo = db.db("IGEXPENSE");
     var x=Math.floor((Math.random() * 100) + 1);
    var myobj = { EmployeeID: x,EmployeeName: req.body.user,"approve":0,Expense: req.body.expense,SDate:req.body.sdate,EDate:req.body.edate,FileLink:req.file.filename,"comment":"",category:req.body.cat};
      dbo.collection("EXPENSECOLLECTION").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });


});*/
//console.log(req.body.multi);
//if(req.body.multi=="true")
//{
task.CheckForSheet(req.body.sheetid,(err,row)=>
{
  console.log(row[0].c);
  if(row[0].c>0)
  {
    console.log("row here");
    task.checkForExpId(req.body.sheetid,(err,row)=>{

      task.insertExpenseline(req.body,row[0].Id,(err,row)=>{


      })
    });
}
else {
  console.log("in else statement")
  task.insertExpense(req.body,1,(err,row)=>{
  task.insertExpenseline(req.body,row[0].Id,(err,row)=>{


    })
  });
}
  /*
  if(row[0].c==0)
  {
  task.insertExpense(req.body,1,(err,row)=>{
  task.insertExpenseline(req.body,row[0].Id,(err,row)=>{


    })
  });
}
else{
  task.checkForExpId(req.body.sheetID,(err,row)=>{

    task.insertExpenseline(req.body,row[0].Id,(err,row)=>{


    })
  })

}*/
});
//}
/*else{
  task.insertExpense(req.body,1,(err,row)=>{
  task.insertExpenseline(req.body,row[0].Id,(err,row)=>{


    })
  });

}
*/

}


});
    // Everything went fine
    /*Email-----------------------------------------------_*/
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "CS_Connect@continuserve.com", // generated ethereal user
              pass: "C$C0^n3ct" // generated ethereal password
          }
      });

      // setup email data with unicode symbols
      let mailOptions = {
          from: 'CS_Connect@continuserve.com', // sender address
          to: 'shadab.k@continuserve.com', // list of receivers
            subject: 'Expense Applied', // Subject line
            text: 'Expense applied by'+ req.body.user, // plain text body
            html: '<p>Expense applied by'+ req.body.user+' for Category :'+req.body.cat+ 'Amount:'+req.body.expense+'</p><p>The date range between'+req.body.sdate+" - "+req.body.edate+'</p><p>Status : Pending for approval</p>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });

});

return res.end("file uploaded");

})
});

/*----------------------------Upload New ______________________________________________*/
app.get('/sheetID', function (req, res) {
  //console.log(req.toString());
var x=uuidv1();
console.log(x);
  x=x.slice(0,7);
return res.json("CSES_"+x.toUpperCase());
});



/*-----------------------------------------------------------------------------*/



















/*

app.get('/', (req, res) => {

  //res.sendFile("/home/shadab/nodefile/uploads/62.jpg");
  MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var dbo = db.db("IGEXPENSE");
   //var query = { "approve": 0 };
   dbo.collection("EXPENSECOLLECTION").find().toArray(function(err, result) {
     if (err) throw err;
     res.send(result);
     db.close();
   });
 });


});*/

app.get('/info/:id', (req, res) => {

  //res.sendFile("/home/shadab/nodefile/uploads/62.jpg");
/*  MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var dbo = db.db("IGEXPENSE");
   //var query = { "approve": 0 };
   dbo.collection("EXPENSECOLLECTION").find({"_id": ObjectId(req.params.id)}).toArray(function(err, result) {
     if (err) throw err;
     res.send(result);
     db.close();
   });
 });*/
task.getExpenseInfo(req.params.id,(err,data)=>{

  if(err)
  {
    res.json(err);
  }
  else {
    {
      res.json(data);
    }
  }
})

});
app.get('/approverexpense/:id', (req, res) => {

task.getApproverInfo(req.params.id,(err,data)=>{

  if(err)
  {
    res.json(err);
  }
  else {
    {
      res.json(data);
    }
  }
})

});
/*new addition */
 app.get('/auth/:username/:password', function(req, res) {
 //  res.render('index', { title: 'Express' })
 //console.log(JSON.stringify(req.body));
 task.getData(req.params.username,(err,row)=>{
   if(err)
   {
   res.json(err);
   }
   else{
     if(req.params.username==row[0].UserName)
     {
     bcrypt.compare(req.params.password, row[0].UserPassword, function(err, data) {
//console.log(data);
//  res.json(res);

if(data)
{
  var x={
    EmployeeId:row[0].EmployeeId,
    CompanyId:row[0].CompanyEmployeeId,
    value:data
  }
  res.json(x);

}
else{
  res.json(data);
}

});
}
else{
  res.json(false);
}
}

   //res.json(row[0].UserPassword)
 })


});
/*new addition */
app.get('/user/:id', (req, res) => {

  //res.sendFile("/home/shadab/nodefile/uploads/62.jpg");
  /*MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var dbo = db.db("IGEXPENSE");
   //var query = { "approve": 0 };
   dbo.collection("Users").find({ "Ename": req.params.id }).toArray(function(err, result) {
     if (err) throw err;
     res.send(result);
     db.close();
   });*/
task.getExpense(req.params.id,(err,data)=>{
if(err)
{
  res.json(err);
}
else {
  {
    res.json(data);
  }
}

});


 });
 /*


*/

app.get('/admin/:emplid', function(req, res) {
//  res.render('index', { title: 'Express' })
//console.log(JSON.stringify(req.body));

task.getAdmin(req.params.emplid,(err,row)=>{
//console.log();
if(row[0].c>0)
{
  res.json(true);
}
else{
  res.json(false);
}

});


});
app.get('/approver/:emplid', function(req, res) {
//  res.render('index', { title: 'Express' })
//console.log(JSON.stringify(req.body));

task.getApprover(req.params.emplid,(err,row)=>{
//console.log();
res.json(row);


});
});
app.get('/approvername/:emplid', function(req, res) {
//  res.render('index', { title: 'Express' })
//console.log(JSON.stringify(req.body));

task.getApprovername(req.params.emplid,(err,row)=>{
//console.log();
res.json(row);


});
});
app.get('/project', function(req, res) {
//  res.render('index', { title: 'Express' })
//console.log(JSON.stringify(req.body));
console.log("here");
task.getProject((err,row)=>{
//console.log();
res.json(row);


});
});



/*
app.get('/user/:id', (req, res) => {

  //res.sendFile("/home/shadab/nodefile/uploads/62.jpg");
  MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var dbo = db.db("IGEXPENSE");
   //var query = { "approve": 0 };
   dbo.collection("EXPENSECOLLECTION").find({ "EmployeeName": req.params.id }).toArray(function(err, result) {
     if (err) throw err;
     res.send(result);
     db.close();
   });
 });


});
*/
app.get('/btype', (req, res) => {

  //res.sendFile("/home/shadab/nodefile/uploads/62.jpg");
  /*MongoClient.connect(url, function(err, db) {
   if (err) throw err;
   var dbo = db.db("IGEXPENSE");
   //var query = { "approve": 0 };
   dbo.collection("category").find().toArray(function(err, result) {
     if (err) throw err;
     res.send(result);
     db.close();
   });
 });*/
 task.getType((err,row)=>{
 //console.log();
 /*if(row[0].c>0)
 {
   res.json(true);
 }
 else{
   res.json(false);
 }*/
 res.json(row);

 });


});
app.get('/status/:val/:id/:comment',(req, res) => {
 var a;
 var r;
  //res.sendFile("/home/shadab/nodefile/uploads/62.jpg");
  /*MongoClient.connect(url,async function(err, db) {
   if (err) throw err;
   var dbo = db.db("IGEXPENSE");
   //var query = { "approve": 0 };
   if(req.params.val==1)
   {
   var myquery = {"_id": ObjectId(req.params.id)};
   a="Approved";
   var newvalues = { $set: {approve: 1,comment:req.params.comment} };
 }
 else if(req.params.val==2){
   var myquery = {"_id": ObjectId(req.params.id)};
   var newvalues = { $set: {approve: 2,comment:req.params.comment} };
   a="Rejected";
 }
 else {
   var myquery = {"_id": ObjectId(req.params.id)};
   var newvalues = { $set: {approve: 0,comment:req.params.comment} };
 }
   dbo.collection("EXPENSECOLLECTION").updateOne(myquery, newvalues, function(err, res) {
     if (err) throw err;
     console.log("1 document updated");
     //res.end("{1 document updated}");
     db.close();
   });
   try {
var results = await dbo.collection("EXPENSECOLLECTION").find({"_id": ObjectId(req.params.id)}).toArray();
    //console.log(user);
    /*Email-----------------------------------------------_*/

task.updateStatus(req.params.id,req.params.val,req.params.comment,(e,d)=>{







 });
  /* console.log({"_id": ObjectId(req.params.id)});
   r=await dbo.collection("EXPENSECOLLECTION").find({"_id": ObjectId(req.params.id)}).toArray();/*function(err, result) {
     if (err) throw err;
    // res.send(result);
    return result;

//console.log(result);
db.close();
});*/
//});
//console.log(r);
    /*Email-----------------------------------------------_*/
  /*  nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "CS_Connect@continuserve.com", // generated ethereal user
                pass: "C$C0^n3ct" // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: 'CS_Connect@continuserve.com', // sender address
            to: 'shadab.k@continuserve.com', // list of receivers
            subject: 'Expense Applied', // Subject line
            text: 'Expense applied by'+ result.EmployeeName, // plain text body
            html: '<p>Expense applied by'+ result.EmployeeName+' for '+result.category+ 'Amount:'+result.Expense+'</p><p>The date range between'+result.SDate+" - "+result.EDate+'</p><p>Status : '+a+' </p><p> Reason : '+result.comment+'</p>' // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });

   });



/*------------------------EMAIL END_____________________________*/
  //   db.close();
   //});
 //});



 return res.json({status:1});

});

app.get("/cemplid/:id", (req, res) => {
  task.getCemplid(req.params.id,(err,row)=>{
    //console.log();
    /*if(row[0].c>0)
    {
      res.json(true);
    }
    else{
      res.json(false);
    }*/
    res.json(row);
   
    });


});


app.get("/sample/:sheetid/:id/:sheetname/:cename", (req, res) => {


  //res.sendFile("/home/shadab/nodefile/uploads/62.jpg");
  //console.log("here"+req.params.id);
/*task.getSheetName(req.params.sheetid,(e,d)=>{
  if(e)
  {

  }
  else {
    {
      res.sendFile("D:\\Expense_APP\\expense_app\\nodefile\\uploads\\"+d[0].SheetName+"\\"+req.params.id+".png");
    }
  }
})*/
var currentPath = process.cwd();
//console.log(currentPath);
example(req.params.id)
 
async function example() {
    const client = new ftp.Client()
    client.ftp.verbose = true
    try {
        await client.access({
            host: "waws-prod-pn1-001.ftp.azurewebsites.windows.net",
            user: "$CSConnectWebApp-Test",
            password: "pQ4AdYmxCGpou4Hh6PSqBqEKD1dpjcuCqLoFD3brCK2nReBjwi94R3GkuTLi",
            secure: false,
            secureOptions: { rejectUnauthorized: false }
        })
        console.log(await client.list())
        console.log('/site/wwwroot/CSIntranet/Expense/ExpenseFiles/${req.params.cename}/${req.params.sheetname}/');
        await client.ensureDir(`/site/wwwroot/CSIntranet/Expense/ExpenseFiles/${req.params.cename}/${req.params.sheetname}/`)
        client.trackProgress()
        if (!fs.existsSync(`${currentPath}/uploads/${req.params.sheetname}`)){
          fs.mkdirSync(`${currentPath}/uploads/${req.params.sheetname}`);
      }
       // await client.download(fs.createReadStream("README.md"), "README.md")
        await client.downloadDir(`${currentPath}/uploads/${req.params.sheetname}`);
    }
    catch(err) {
        console.log(err)
    }
    client.close()
}

res.sendFile(`${currentPath}/uploads/${req.params.cename}/${req.params.sheetname}/${req.params.id}.png`);



});
app.get('/fs/:lat/:lng/:query', (req, res) => {
 var x=req.params.lat+','+ req.params.lng;
var params = {
        "ll": x,
        "query":req.params.query,
        "intent":"match"

    };
foursquare.exploreVenues(params, function(error, venues) {
        if (!error) {
  		//	console.log(JSON.stringify(venues,undefined,2));
        res.send(venues);
      }}
      );

//res.end(JSON.stringify(params));


});
app.get('/fs2/:lat/:lng/:query', (req, res) => {
 var x=req.params.lat+','+ req.params.lng;
var params = {
        "ll": x,
        "categoryId":req.params.query,
        "intent":"match",
        "limit":10


    };
foursquare.exploreVenues(params, function(error, venues) {
        if (!error) {
  		//	console.log(JSON.stringify(venues,undefined,2));
        res.send(venues);
      }}
      );

//res.end(JSON.stringify(params));


});
// It's very crucial that the file name matches the name attribute in your html
/*app.post('/upload', upload.single('fileName'), (req, res) => {
  res.end({'Status':'ok'});
});*/

app.listen(3000);
