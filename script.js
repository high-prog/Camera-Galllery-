// const shortid = require("shortid");

let video = document.querySelector("video");
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtn = document.querySelector(".capture-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let timer = document.querySelector(".timer");

let filerLayer = document.querySelector(".filter-layer");
let transparentColor = "transparent";


let recordFlag = false;
let recorder;
let chunks = [] //media data in chunks

let constraints = {
    video : true,
    audio : true
}


//navigator ->global browser info(under window)
navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {
    video.srcObject = stream;

    //mediaRecorder for recording
    recorder = new MediaRecorder(stream);

    recorder.addEventListener("start",(e)=>{
        chunks = [];
    })

    recorder.addEventListener("dataavailable", (e)=>{
        chunks.push(e.data);
    })
    recorder.addEventListener("stop",(e)=>{
        //conversion to video
        let blob = new Blob(chunks, {type: "video/mp4"});
        let videeoURL = window.URL.createObjectURL(blob);


        if(db){
            let videoId = shortid();
            let dbTransaction = db.transaction("video","readwrite");
            let videoStore = dbTransaction.objectStore("video");
            let videoEntry = {
                id: `vid-${videoId}`,
                blobData: blob
            }
            videoStore.add(videoEntry);
        }

       

    })
})

recordBtnCont.addEventListener("click",(e) => {
    if(!recorder) return;
    recordFlag = !recordFlag;

    if(recordFlag){
        //start
        recorder.start();
        startTimer();
        recordBtn.classList.add("scale-record");
    }
    else{
        //stop
        recorder.stop();
        stopTimer();
        recordBtn.classList.remove("scale-record");
    }


})



captureBtnCont.addEventListener("click",(e)=>{
    let canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    let tool = canvas.getContext('2d');
    tool.drawImage(video,0,0,video.videoWidth,video.videoHeight);

    //filtering
    tool.fillStyle = transparentColor; 
    tool.fillRect(0,0,canvas.width,canvas.height);
    let imageURL = canvas.toDataURL();

    if(db){
        let imageId = shortid();
        let dbTransaction = db.transaction("image","readwrite");
        let imageStore = dbTransaction.objectStore("image");
        let imageEntry = {
            id: `img-${imageId}`,
            url: imageURL
        }
        imageStore.add(imageEntry);
    }
    
})

// filter work
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
    filterElem.addEventListener("click", (e) => {
        transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
        filerLayer.style.backgroundColor = transparentColor;
        filerLayer.style.backgroundBlendMode = "color-burn";
    })
})











let timerId;
let counter = 0; //represents total seconds

function startTimer(){
    timer.style.display = "block";
    timerId = setInterval(displayTimer,1000);
    function displayTimer(){
        let totatseconds = counter;
        let hours = Number.parseInt(totatseconds/3600);
        totatseconds = totatseconds%3600;
        let minutes = Number.parseInt(totatseconds/60);
        totatseconds - totatseconds%60;
        let seconds = totatseconds;

        hours = (hours<10)?`0${hours}`:hours;
        minutes = (minutes<10)?`0${minutes}`:minutes;
        seconds = (seconds<10)?`0${seconds}`:seconds;


        timer.innerText = `${hours}:${minutes}:${seconds}`;
        
        counter++;
    }
}

function stopTimer(){
    clearInterval(timerId);
    timer.innerHTML = "00:00:00";
    counter = 0;
    timer.style.display = "none";
}