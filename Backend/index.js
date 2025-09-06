const express=require('express');
const cors=require('cors');
const PORT=5000;
const app=express();
app.use(cors());
const router=require('./routes/routes');
app.use(express.json());
app.use('/',router);
app.listen(PORT,()=>{console.log(`Server is running on port http://localhost:${PORT}`)});