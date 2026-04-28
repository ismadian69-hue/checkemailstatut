import dns from "dns/promises";

const disposable = [
"tempmail.com","10minutemail.com","guerrillamail.com","mailinator.com"
];

export default async function handler(req,res){

const email=(req.query.email||"").toLowerCase().trim();

if(!email.includes("@") || email.split("@").length!==2){
 return res.status(200).json({
   status:"invalid",
   reason:"bad format"
 });
}

const [name,domain]=email.split("@");

if(disposable.includes(domain)){
 return res.status(200).json({
   status:"risky",
   reason:"disposable domain"
 });
}

if(["info","admin","support","sales"].includes(name)){
 return res.status(200).json({
   status:"risky",
   reason:"role email"
 });
}

try{
 const mx=await dns.resolveMx(domain);

 if(mx.length>0){
   return res.status(200).json({
     status:"valid",
     reason:"mx found"
   });
 }

 return res.status(200).json({
   status:"invalid",
   reason:"no mx"
 });

}catch(e){
 return res.status(200).json({
   status:"invalid",
   reason:"domain failed"
 });
}

}
