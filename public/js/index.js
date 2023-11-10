const video = document.getElementById('video')

let list_electeur = JSON.parse(electeurs_stringify.replaceAll('&#34;', "\""))
// let list_vote = JSON.parse(votes_stringify.replaceAll('&#34;',"\""))

// console.log(electeurs_stringify);

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

let oo = []
list_electeur.forEach(li => {
    oo.push(li.identite + " - " + li.fokontany + " - " + li.commune + " - " + li.district + " - " + li.region + " - " + li.province)
})
function getLabeledFaceDescriptions() {

    let labels = []

    for (let elect of list_electeur) {
        labels.push({
            label: elect.nom + " - " + elect.identite,
            images: [elect.photo, elect.photo2]
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

    let res = document.querySelector("#cam-play")

    // <div id="resultat"></div>

    let div = document.createElement("div")
    div.id = "resultat"

    const canvas = faceapi.createCanvasFromMedia(video)
    document.querySelector(".faciale").prepend(canvas)
    const displaySize = { width: video.width, height: video.height }
    faceapi.matchDimensions(canvas, displaySize)
    setInterval(async () => {
        // const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        let context = canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

        faceapi.draw.drawDetections(canvas, resizedDetections)

        // console.log(canvas);
        //faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)

        
        const results = resizedDetections.map((im) => {
            return faceMatcher.findBestMatch(im.descriptor);
        });
        // console.log(results);

        results.forEach((result, i) => {

            let box = resizedDetections[i].detection.box;
            //console.log(box)
            const drawBox = new faceapi.draw.DrawBox(box, {
                label: result,
                boxColor: "#00FF1A",
                lineWidth: 3,
                drawLabelOptions :{
                    // anchorPosition: "BOTTOM_RIGHT",
                    backgroundColor: '#00FF1A',
                    padding : 15,
                    fontSize : 18,
                    fontStyle : "bold"
                 }
            });
            drawBox.draw(canvas);

            for (let electeur of list_electeur) {
                

                if (result.label == electeur.nom + " - " + electeur.identite) {

                    video.pause()

                    setTimeout(()=>{
                        
                        document.querySelector(".faciale").classList.add("d-none")
                        writeElector(div, JSON.stringify(electeur))
                        res.appendChild(div)
                    },3000)

                    // runSpinner()

                    setTimeout(() => {
                        runSpinner()
                        location.href = "/election?id=" + electeur.id
                    }, 5000)

                }
            }

        });
    }, 200)
})

function writeElector(div, electo) {
    let elector = JSON.parse(electo)
    div.innerHTML = `
    <div class="card-profil">
        <img class="show-profile" src="${elector.photo}" alt="${elector.identite}">
        <label class="nom-profil">${elector.nom}</label>
        <p class="identite-profil">CIN : ${elector.identite}</p>
        <p class="p-profil">${elector.fokontany} - ${elector.commune} - ${elector.district}</p>
        <p><button class="button-profil">${elector.province}</button></p>
    </div>

    `
    document.querySelector("#title_").innerText = "(Ianao dia fantatry ny programa)"
}
