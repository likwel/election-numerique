fetch('/getAllElector').then(response => response.json())
    .then(electeurs => {

        let lis = ''

        if (electeurs.length > 0) {
            for (let electeur of electeurs) {
                lis += `<tr>
            <td style="width:20px;">${electeur.id}</td>
            <td>${electeur.identite}</td>
            <td>${electeur.nom}</td>
            <td><img class="photo-electeur" src="${electeur.photo}"><img class="photo-electeur" src="${electeur.photo2}"></td>
            <td><a href="/bureau-de-vote?id=${electeur.id_fokontany}" style="color: blue;">${electeur.id_fokontany}</a></td>
            <td><button class="btn btn-success" onclick="hanova(${electeur.id},'${electeur.nom}','${electeur.identite}','${electeur.photo}','${electeur.photo2}')"><i class="fa-regular fa-pen-to-square"></i>Hanova</button><button class="btn btn-danger" onclick="hamafa(${electeur.id})"><i class="fa-solid fa-user-xmark"></i>Fafàna</button></td>
            </tr>`
            }

            document.querySelector("#inner-liste-electorale").innerHTML = lis

            // new DataTable('#mon-table');

        } else {

            document.querySelector("#inner-liste-electorale").innerHTML = "<h3 style='color:red;margin:15px;'>Aucun électeur enregistré pour le moment.</h3>"
        }

        $('#mon-table').DataTable({
            "language": {
                url: '/static/mg-MG.json',
            }
        });

})

function closeModal() {
    document.querySelector("#modal").classList.add("d-none");
    document.querySelector("#modal").classList.remove("op-1");
    document.querySelector("body").classList.remove("modal-open");
}

function openModal() {
    document.querySelector("#modal").classList.remove("d-none");
    document.querySelector("#modal").classList.add("op-1");
    document.querySelector("body").classList.add("modal-open");

    document.querySelector('#id-hidden').value = 0
    document.querySelector('#type-hidden').value = "create"
    document.querySelector('#nom-electeur').value = ""
    document.querySelector('#cin-electeur').value =""
    document.querySelector('#photo-electeur').value = ""
    document.querySelector('#photo2-electeur').value =""

    fetch('/getAllProvince').then(r=>r.json())
    .then(data=>{
        let htm = '<option value="0">Safidio</option>'
        for(let pro of data){
            htm+=`<option value="${pro.id}">${pro.nom}</option>`
        }

        document.querySelector("#province-electeur").innerHTML = htm
    })
}

function saveElector() {
    let data = {
        nom: document.querySelector('#nom-electeur').value,
        identite: document.querySelector('#cin-electeur').value,
        photo: document.querySelector('#photo-electeur').value,
        photo2: document.querySelector('#photo2-electeur').value
    }

    console.log(data);
}


function hamafa(id) {
    
    Swal.fire({
        title: 'Hamàfa?',
        text: "Hamarininao ve ny famafàna ity olona ity ato?",
        icon: 'question',
        confirmButtonColor: '#d33',
        confirmButtonText: '<i class="fa-solid fa-user-xmark"></i> Eny, fafàna'
    }).then((result) => {
        if (result.isConfirmed) {

            Swal.fire(
                'Voafafa!',
                'Voafafa tanteraka io olona io',
                'success'
            )
            location.href = '/destroy-electeur/' + id
        }
    })

}

function hanova(id, nom, identite, photo, photo2){
    openModal()

    // console.log(JSON.parse(electeur));

    // let ele = JSON.parse(electeur)
    
    document.querySelector('#id-hidden').value = id
    document.querySelector('#type-hidden').value = "update"
    document.querySelector('#nom-electeur').value = nom
    document.querySelector('#cin-electeur').value =identite
    document.querySelector('#photo-electeur').value = photo
    document.querySelector('#photo2-electeur').value =photo2
}

function selectRegion(province){

    let id = province.value
    fetch('/getAllRegion/'+id).then(r=>r.json())
    .then(data=>{
        let htm = '<option value="0">Safidio</option>'
        for(let pro of data){

            htm+=`<option value="${pro.id}">${pro.nom}</option>`
        }

        document.querySelector("#region-electeur").innerHTML = htm
    })
}

function selectDistrict(region){

    let id = region.value
    fetch('/getAllDistrict/'+id).then(r=>r.json())
    .then(data=>{
        let htm = '<option value="0">Safidio</option>'
        for(let pro of data){
            htm+=`<option value="${pro.id}">${pro.nom}</option>`
        }

        document.querySelector("#district-electeur").innerHTML = htm
    })
}


function selectCommune(district){

    let id = district.value
    fetch('/getAllCommune/'+id).then(r=>r.json())
    .then(data=>{
        let htm = '<option value="0">Safidio</option>'
        for(let pro of data){
            htm+=`<option value="${pro.id}">${pro.nom}</option>`
        }

        document.querySelector("#commune-electeur").innerHTML = htm
    })
}


function selectFokontany(commune){

    let id = commune.value
    fetch('/getAllFokontany/'+id).then(r=>r.json())
    .then(data=>{
        let htm = '<option value="0">Safidio</option>'
        for(let pro of data){
            htm+=`<option value="${pro.id}">${pro.nom}</option>`
        }

        document.querySelector("#fokontany-electeur").innerHTML = htm
    })
}