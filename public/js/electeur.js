fetch('/getAllElector').then(response => response.json())
    .then(electeurs => {

        let lis = ''

        if (electeurs.length > 0) {
            for (let electeur of electeurs) {
                lis += `<tr>
            <td style="width:20px;">${electeur.id}</td>
            <td>${electeur.identite}</td>
            <td>${electeur.nom}</td>
            <td>
                <img class="photo-electeur" src="${electeur.photo}">
                <label for="edit-photo${electeur.nom}"><i class="fa-solid fa-camera change-image"></i></label>
                <input type="file" id="edit-photo${electeur.nom}" class="input-photo" onchange='updatePhoto(this, 1, ${JSON.stringify(electeur)})'>

                <img class="photo-electeur" src="${electeur.photo2}">
                <label for="edit-photo${electeur.nom}2"><i class="fa-solid fa-camera change-image"></i></label>
                <input type="file" id="edit-photo${electeur.nom}2" class="input-photo" onchange='updatePhoto(this, 2, ${JSON.stringify(electeur)})'>
            </td>
            <td><a href="/bureau-de-vote?id=${electeur.id_fokontany}" style="color: blue;">${electeur.id_fokontany}</a></td>
            <td><button class="btn btn-success" onclick='hanova(${JSON.stringify(electeur)})'><i class="fa-regular fa-pen-to-square"></i>Hanova</button><button class="btn btn-danger" onclick="hamafa(${electeur.id})"><i class="fa-solid fa-user-xmark"></i>Fafàna</button></td>
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
    document.querySelector('#cin-electeur').value = ""
    document.querySelector('#photo-electeur').value = ""
    document.querySelector('#photo2-electeur').value = ""

    document.querySelector("#fokontany-electeur").innerHTML = ""
    document.querySelector("#commune-electeur").innerHTML = ""
    document.querySelector("#district-electeur").innerHTML = ""
    document.querySelector("#region-electeur").innerHTML = ""

    document.querySelector('#photo-electeur').required = true
    document.querySelector('#photo2-electeur').required = true
    document.querySelector('#photo-electeur').classList.remove("d-none")
    document.querySelector('#photo-electeur').previousElementSibling.classList.remove("d-none")
    document.querySelector('#photo2-electeur').classList.remove("d-none")
    document.querySelector('#photo2-electeur').previousElementSibling.classList.remove("d-none")

    setProvinceListeDefault(0)
}

function setProvinceListeDefault(selected) {
    fetch('/getAllProvince').then(r => r.json())
        .then(data => {
            let htm = '<option value="0">Safidio</option>'
            for (let pro of data) {
                if (pro.id == selected) {
                    htm += `<option value="${pro.id}" selected>${pro.nom}</option>`
                } else {
                    htm += `<option value="${pro.id}">${pro.nom}</option>`
                }
                // htm+=`<option value="${pro.id}">${pro.nom}</option>`
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

function hanova(el) {
    openModal()

    // console.log(el);

    document.querySelector('#id-hidden').value = el.id
    document.querySelector('#type-hidden').value = "update"
    document.querySelector('#nom-electeur').value = el.nom
    document.querySelector('#cin-electeur').value = el.identite
    document.querySelector('#photo-electeur').required = false
    document.querySelector('#photo2-electeur').required = false
    document.querySelector('#photo-electeur').classList.add("d-none")
    document.querySelector('#photo-electeur').previousElementSibling.classList.add("d-none")
    document.querySelector('#photo2-electeur').classList.add("d-none")
    document.querySelector('#photo2-electeur').previousElementSibling.classList.add("d-none")

    document.querySelector("#title-modale").innerHTML = `<i class="fa-regular fa-pen-to-square"></i>Hanova mpifidy`

    document.querySelector("#fokontany-electeur").innerHTML = `<option value="${el.id_fokontany}" selected>${el.fokontany}</option>`
    document.querySelector("#commune-electeur").innerHTML = `<option value="${el.id_commune}" selected>${el.commune}</option>`
    document.querySelector("#district-electeur").innerHTML = `<option value="${el.id_district}" selected>${el.district}</option>`
    document.querySelector("#region-electeur").innerHTML = `<option value="${el.id_region}" selected>${el.region}</option>`

    // document.querySelector("#province-electeur").innerHTML = ""

    // console.log(el.id_province);

    // console.log(document.querySelector("#province-electeur"));
    // document.querySelector("#province-electeur").value =el.id_province

    setProvinceListeDefault(el.id_province)
}

function selectRegion(province) {

    let id = province.value
    fetch('/getAllRegion/' + id).then(r => r.json())
        .then(data => {
            let htm = '<option value="0">Safidio</option>'
            for (let pro of data) {

                htm += `<option value="${pro.id}">${pro.nom}</option>`
            }

            document.querySelector("#region-electeur").innerHTML = htm
        })
}

function selectDistrict(region) {

    let id = region.value
    fetch('/getAllDistrict/' + id).then(r => r.json())
        .then(data => {
            let htm = '<option value="0">Safidio</option>'
            for (let pro of data) {
                htm += `<option value="${pro.id}">${pro.nom}</option>`
            }

            document.querySelector("#district-electeur").innerHTML = htm
        })
}


function selectCommune(district) {

    let id = district.value
    fetch('/getAllCommune/' + id).then(r => r.json())
        .then(data => {
            let htm = '<option value="0">Safidio</option>'
            for (let pro of data) {
                htm += `<option value="${pro.id}">${pro.nom}</option>`
            }

            document.querySelector("#commune-electeur").innerHTML = htm
        })
}


function selectFokontany(commune) {

    let id = commune.value
    fetch('/getAllFokontany/' + id).then(r => r.json())
        .then(data => {
            let htm = '<option value="0">Safidio</option>'
            for (let pro of data) {
                htm += `<option value="${pro.id}">${pro.nom}</option>`
            }

            document.querySelector("#fokontany-electeur").innerHTML = htm
        })
}

function updatePhoto(elem, num, electeur) {
    const file = elem.files[0];

    const reader = new FileReader();
    reader.onload = function () {
        const data_url = reader.result;

        let data = {
            id : electeur.id,
            nom : electeur.nom,
            identite : electeur.identite,
            file : data_url
        }

        fetch('/change-photo/'+num, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(data)
        }).then(res=>{
            if(res.ok && res.status == 200){
                location.href ="/liste-electorale"
            }
            // console.log(res);
        })
    };
    reader.readAsDataURL(file);
}
