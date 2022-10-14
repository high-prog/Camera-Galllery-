setTimeout(()=>{
    let galleryCont = document.querySelector(".gallery-cont") ;
    if(db){
        //videos retrieval
        let dbTransaction = db.transaction("video","readonly");
        let videoStore = dbTransaction.objectStore("video");
        let videoRequest = videoStore.getAll(); //event driven
        videoRequest.onsuccess = (e) => {
            let videoResult = videoRequest.result;
            videoResult.forEach((videoObj) =>{
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",videoObj.id);
                let url = URL.createObjectURL(videoObj.blobData);
                mediaElem.innerHTML = `
                <div class="media">
                    <video src="${url}" autoplay loop></video>
                 </div>
            <div class="action-cont">
                
                    <span class="material-icons download">
                        download
                    </span>
                
                
                    <span class="material-icons delete">
                        delete
                    </span>
                
            </div>
                `;
                galleryCont.appendChild(mediaElem);


                //Listeners
                let deleteBtn = mediaElem.querySelector(".delete");
                deleteBtn.addEventListener("click",dltListener);
                let downloadBtn = mediaElem.querySelector(".download");
                downloadBtn.addEventListener("click",downloadListener);

            })
        }
        
        
        //image retrieval
        let dbTransactionI = db.transaction("image","readonly");
        let imageStore = dbTransactionI.objectStore("image");
        let imageRequest = imageStore.getAll(); //event driven
        imageRequest.onsuccess = (e) => {
            let imageResult = imageRequest.result;
            imageResult.forEach((imgObj) =>{
                let mediaElem = document.createElement("div");
                mediaElem.setAttribute("class","media-cont");
                mediaElem.setAttribute("id",imgObj.id);

                let url = imgObj.url;
                mediaElem.innerHTML = `
                <div class="media">
                    <img src="${url}" ></img>
                 </div>
                <div class="action-cont">
                    <span class="material-icons download">
                        download
                    </span>
                    <span class="material-icons delete">
                        delete
                    </span>
            </div>
                `;
            galleryCont.appendChild(mediaElem);

            //listeners
            let deleteBtn = mediaElem.querySelector(".delete");
            deleteBtn.addEventListener("click",dltListener);
            let downloadBtn = mediaElem.querySelector(".download");
            downloadBtn.addEventListener("click",downloadListener);

            })
        }

    
    }
},100)


//ui remove and then db remove
function dltListener(e){ 
    let id = e.target.parentElement.parentElement.getAttribute("id");
    if(id.slice(0,3) === "vid"){
        //DB removal
        let dbTransaction = db.transaction("video","readwrite");
        let videoStore = dbTransaction.objectStore("video");
        videoStore.delete(id);

    }else if(id.slice(0,3) === "img"){
        let dbTransactionI = db.transaction("image","readwrite");
        let imageStore = dbTransactionI.objectStore("image");
        imageStore.delete(id);
    }
    //UI removal
    e.target.parentElement.parentElement.remove();

}

function downloadListener(e){
    let id = e.target.parentElement.parentElement.getAttribute("id");
    let type = id.slice(0,3);
    if(type === "vid"){
        let dbTransaction = db.transaction("video","readwrite");
        let videoStore = dbTransaction.objectStore("video");
        let videoReq = videoStore.get(id);
        videoReq.onsuccess = (e) => {
            let vidResult = videoReq.result;

            let videeoURL = URL.createObjectURL(vidResult.blobData);

            let a = document.createElement("a");
            a.href = videeoURL;
            a.download = "Stream.mp4";
            a.click();
        }
    }else if(type === "img"){
        let dbTransactionI = db.transaction("image","readwrite");
        let imageStore = dbTransactionI.objectStore("image");
        let imgReq = imageStore.get(id);
        imgReq.onsuccess = (e) => {
            let imgResult = imgReq.result;
            let a = document.createElement("a");
            a.href = imgResult.url;
            a.download = "img.jpeg";
            a.click();

        }
        
        
    }

}