const http=require('http');
const fs=require('fs');
const path=require('path');
function bmiStatus(bmi){
  let res;
  if(bmi<18.5){
    res='underweight';
  }
  else if(bmi>=18.5 && bmi<24.9){
    res='normal weight';
  }
  else if(bmi>25.0 && bmi<29.9){
    res='overweight'
  }
  else if(bmi>30.0 && bmi<34.9){
    res='obesity class 1';
  }
  else if(bmi>35 && bmi<39.9){
    res='obesity class 2'
  }
  else{
    res='obesity class 3 (severe obesity)';
  }
  return res;
}
function requestListener(req,res){
  const url=req.url;
  const method=req.method;

  if(url==='/bmi.css'){
    res.setHeader('Content-Type','text/css');
    fs.readFile(path.join(__dirname,'bmi.css'),(err,data)=>{
      res.write(data);
      res.end();
    })
  }
  else if(url==='/' || url==='/home'){
    res.setHeader('Content-Type','text/html');
    res.write(`
    <html>
    <head>
      <link rel="stylesheet" href="bmi.css">
    </head>
<body>
    <div class="container">
    <h1>Enter Your Details</h1>
      <form action="/calculate" method="POST">
        <input type="number" name="weight" placeholder="Enter your weight in kgs" step="0.01" required><br><br>
        <input type="number" name="height" placeholder="Enter your height in meters" step="0.01" required><br><br>
       <button type="submit" class="checkButton">Calculate</button>
      </form>
  </div>
</body>
</html>
    `)
      res.end();
  }
  else if(url==='/calculate' && method==="POST"){
    let body='';
    req.on('data',function(chunk){
      body+=chunk.toString();
    })
    req.on('end',function(){
      const param=new URLSearchParams(body);
      const height=param.get('height');
      const weight=param.get('weight');
      const heightSqr=height**2;
      const result=(weight)/heightSqr;
      const bmi=result.toFixed(2);
      const bmiCheck=bmiStatus(bmi);
      res.setHeader('Content-Type','text/html');
      res.write(`
<html>
<head>
  <link rel="stylesheet" href="bmi.css">
</head>
<body>
  <div class="cont">
    <h1>Your BMI is :${bmi}</h1>
    <h2>Status:${bmiCheck}</h2>
    <a href="/">Go back</a>
  </div>
</body>
</html>
        `)
      res.end();
    })
  }
}
const pots=3008;
const server=http.createServer(requestListener);
function listenRequest(){
  console.log(`your server is running at the address http://localhost:${pots}`);
}
server.listen(pots,listenRequest);
