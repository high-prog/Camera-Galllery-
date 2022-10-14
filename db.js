//open Database
//create objectStore (can only be opened in upgradeneeded)
//Make Transaction
let db;
let openRequest = indexedDB.open("myDatabase");

openRequest.addEventListener("success",(e)=>{
    console.log("Db success");
    db = openRequest.result;
});
openRequest.addEventListener("error",(e)=>{
    console.log("Db Error");
});
openRequest.addEventListener("upgradeneeded",(e)=>{ 
    console.log("db upgraded and also for initial DB creation");
    db = openRequest.result;

    db.createObjectStore("video", {keyPath: "id"});
    db.createObjectStore("image", {keyPath : "id"});

;});


