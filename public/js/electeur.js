
// let electeur = {
//     identite: req.body.identite,
//     nom: req.body.nom,
//     photo: req.body.photo,
//     photo2: req.body.photo2
// }

fetch('/getAllElector').then(response=>response.json())
.then(electeurs=>{

    let lis = ''

    if(electeurs.length > 0){
        for(let electeur of electeurs){
            lis+=`<tr>
            <td style="width:20px;">${electeur.id}</td>
            <td>${electeur.identite}</td>
            <td>${electeur.nom}</td>
            <td><img class="photo-electeur" src="${electeur.photo}"></td>
            <td><img class="photo-electeur" src="${electeur.photo2}"></td>
            <td><button class="btn btn-success">Editer</button><button class="btn btn-danger">Supprimer</button></td>
            </tr>`
        }
        
        document.querySelector("#inner-liste-electorale").innerHTML=lis

        $('#mon-table').DataTable({
            "language": {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json',
            }
        });

        // new DataTable('#mon-table');

    }else{

        document.querySelector("#inner-liste-electorale").innerHTML="<h3 style='color:red;margin:15px;'>Aucun électeur enregistré pour le moment.</h3>"
    }

})

function closeModal(){
    document.querySelector("#modal").classList.add("d-none");
    document.querySelector("#modal").classList.remove("op-1");
    document.querySelector("body").classList.remove("modal-open");
}

function openModal() {
    document.querySelector("#modal").classList.remove("d-none");
    document.querySelector("#modal").classList.add("op-1");
    document.querySelector("body").classList.add("modal-open");
}

function saveElector(){
    let data = {
        nom : document.querySelector('#nom-electeur').value,
        identite : document.querySelector('#cin-electeur').value,
        photo : document.querySelector('#photo-electeur').value,
        photo2 : document.querySelector('#photo2-electeur').value
    }

    console.log(data);
}
