const cors = require("cors");
const express = require("express");

const app = express();

app.use("/", async(rq, rs)=>{
rs.send("on a endpoint")
})

app.listen(5000, ()=> console.log("Server listening at port 5000"))
