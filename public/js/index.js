const video = document.getElementById('video')

let list_electeur = JSON.parse(electeurs_stringify.replaceAll('&#34;',"\""))
let list_vote = JSON.parse(votes_stringify.replaceAll('&#34;',"\""))

console.log(list_vote);

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
]).then(startVideo)

function startVideo() {
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}


function getLabeledFaceDescriptions() {

    let labels = []

    for(let elect of list_electeur){
        labels.push({
            label : elect.nom +"-"+elect.identite,
            images : [elect.photo, elect.photo2]
        })
    }

    return Promise.all(
        
        labels.map(async (label) => {
            const descriptions = [];
            for (let i = 0; i < label.images.length; i++) {
                const img = await faceapi.fetchImage(`${label.images[i]}`);
                // const img = await faceapi.fetchImage(`{/labels/${label}/${i}.jpg}`);
                const detections = await faceapi
                    .detectSingleFace(img)
                    .withFaceLandmarks()
                    .withFaceDescriptor();
                descriptions.push(detections.descriptor);
            }
            return new faceapi.LabeledFaceDescriptors(label.label, descriptions);
        })
    );
}

video.addEventListener('play', async () => {

    const labeledFaceDescriptors = await getLabeledFaceDescriptions();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

    let res = document.querySelector("#resultat")

    const canvas = faceapi.createCanvasFromMedia(video)
    document.querySelector(".faciale").prepend(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        // const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        faceapi.draw.drawDetections(canvas, resizedDetections)
        // console.log(canvas);
        // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        const results = resizedDetections.map((im) => {
            // console.log(im);
            return faceMatcher.findBestMatch(im.descriptor);
        });

        // console.log(list_electeur);

        results.forEach((result, i) => {

            // console.log(result);
            const box = resizedDetections[i].detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, {
                label: result,
            });
            drawBox.draw(canvas);

            // res.innerHTML += result.label + " a éssayé d'entrer dans le bureau de vote n° 01, le " + new Date().toLocaleString() + "<br>----------------------<br>"
            // res.scrollIntoView(false);

            

            for(let electeur of list_electeur){
                if(result.label == electeur.nom+"-"+electeur.identite){
                    for(let vote of list_vote){
                        res.innerHTML+=vote.electeur_id + '****'+electeur.id
                        // if(vote.electeur_id == electeur.id){
                            
                        //     res.innerHTML+="Efa teo ianao fa aza mandainga"
                        //     console.log("Efa teo ianao fa aza mandainga");
                        // }else{
                        //     res.innerHTML+="/election?id="+electeur.id
                        //     // setInterval(() => {
                        //     //     location.href = "/election?id="+electeur.id
                        //     // }, 3000)
                        // }
                    }
                    
                }
            }

            // if (result.label == "Elie") {
            //     setInterval(() => {
            //         location.href = "/election"
            //     }, 5000)
            // }
        });
    }, 100)
})