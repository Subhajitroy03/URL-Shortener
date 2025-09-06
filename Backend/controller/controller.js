const shortid = require("shortid")
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
async function getshorturl(req,res){
    const {longurl}=req.body;
    if (!longurl && !longurl.startsWith('http://') && !longurl.startsWith('https://')) {
        return res.status(400).json({ error: "Valid URL is required" });
    }
    const shorturl=shortid.generate();
    const user=await prisma.user.create({
        data:{
            url:longurl,
            shorturl:shorturl
        }
    });
    res.json(user);
}
async function getlongurl(req,res){
    const {shorturl}=req.params;
    const url=await prisma.user.findUnique({
        where:{
            shorturl:shorturl
        }
    });
    if (!url) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    const updatecount=await prisma.user.update({
        where:{
            shorturl:shorturl
        },
        data:{
            count:parseInt(url.count)+1
        }
    });
    res.redirect(url.url);
}
async function geturl(req,res){
    const url=await prisma.user.findMany();
    if (!url) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    res.json(url);
}
async function deleteurl(req,res){
    const {id}=req.params;
    const url=await prisma.user.delete({
        where:{
            id:parseInt(id)
        }
    });
    if (!url) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    res.json({message:"URL deleted successfully"});
    
}
module.exports={getshorturl,getlongurl,geturl,deleteurl};