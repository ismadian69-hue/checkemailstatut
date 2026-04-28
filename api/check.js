import dns from "dns/promises";

const tempDomains = [
"tempmail.com",
"10minutemail.com",
"guerrillamail.com",
"mailinator.com"
];

export default async function handler(req,res){

const email=(req.query.email||"").trim().toLowerCase();

if(!email.includes("@") || email.split("@").length!==2){
 return res.status(200).json({
   status:"invalid",
   reason:"bad format"
 });
}

const [name,domain]=email.split("@");

if(tempDomains.includes(domain)){
 return res.status(200).json({
   status:"risky",
   reason:"temporary mail"
 });
}

if(["info","admin","sales","support"].includes(name)){
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
