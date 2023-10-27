
window.onload = () => {
    fetch("/static/candidat.json")
        .then(response => {
            return response.json();
        }).then(candidats => {
            // console.log(jsondata)
            let ul1 = ""
            let ul2 = ""
            let iter = 0
            for (let candidat of candidats.candidat) {

                if (iter <= 6) {
                    ul1 += `
                    <li class="candidat">
                        <div class="items-candidat">
                            <div class="numero-candidat">
                                <p >${candidat.id.toString().padStart(2, '0')}</p> 
                            </div>
                            <img class="photo-candidat" src="${candidat.logo}" alt="canditat n°" />
                            <img class="photo-candidat" src="${candidat.photo}" alt="canditat n°" />
                            <!--<label class="nom-candidat">${candidat.nom}</label>-->
                            <input class="check-candidat" type="checkbox" onclick='choose(this, ${JSON.stringify(candidat)})'>
                        </div>
                    </li>
                    `
                } else {
                    ul2 += `
                    <li class="candidat">
                        <div class="items-candidat">
                            <div class="numero-candidat">
                                <p >${candidat.id.toString().padStart(2, '0')}</p> 
                            </div>
                            <img class="photo-candidat" src="${candidat.logo}" alt="canditat n°" />
                            <img class="photo-candidat" src="${candidat.photo}" alt="canditat n°" />
                            <!--<label class="nom-candidat">${candidat.nom}</label>-->
                            <input class="check-candidat" type="checkbox" onclick='choose(this, ${JSON.stringify(candidat)})'>
                        </div>
                    </li>
                    `
                }

                iter++;
            }
            document.querySelectorAll('#ul-candidat')[0].innerHTML = ul1
            document.querySelectorAll('#ul-candidat')[1].innerHTML = ul2
        });
}

function choose(elem, candidat) {

    document.querySelectorAll(".check-candidat").forEach(check => {
        check.checked = false;
    })
    elem.checked = true

    if (elem.checked) {

        document.querySelector("#modal").classList.remove("d-none");
        document.querySelector("#modal").classList.add("op-1");
        document.querySelector("body").classList.add("modal-open");

        document.querySelector("#confirm-candidat").innerHTML = `
                <div class="alert-content">
                    <label class="alert-label">Ny kandidat nofidianao dia i </label><br>
                    <span class="nom-style">${candidat.nom}</span>
                    <div class="alert-candidat">
                        <div class="candidat">
                            <div class="items-candidat">
                                <div class="numero-candidat">
                                    <p >${candidat.id.toString().padStart(2, '0')}</p> 
                                </div>
                                <img class="photo-candidat" src="${candidat.logo}" alt="canditat n°" />
                                <img class="photo-candidat" src="${candidat.photo}" alt="canditat n°" />
                                <!--<label class="nom-candidat">${candidat.nom}</label>-->
                                <input class="check-candidat" type="checkbox" checked>
                            </div>
                        </div>
                    </div>
                    <div class="alert-footer">
                        <button class="candidat-non" onclick="closeAlert()">Tsia</button>
                        <button class="candidat-oui" onclick="accepter(1, ${candidat.id}, '${candidat.nom}')">Eny</button>
                    </div>
                </div>
            `
    }

}

function closeAlert() {
    document.querySelector("#modal").classList.add("d-none");
    document.querySelector("#modal").classList.remove("op-1");
    document.querySelector("body").classList.remove("modal-open");
    // document.querySelectorAll(".check-candidat").forEach(check=>{
    //     check.checked = false;
    // })
}

function accepter(electeur, id, nom) {
    // console.log(JSON.parse(candidat));
    closeAlert()

    let data = {
        "electeur_id" : electeur,
        "candidat_id" : id,
        "candidat_nom" : nom
    }

    fetch('/election/send', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        if(res.ok && res.status == 200){
            window.location.href = "/election"
        }else{
            window.location.href = "/election"
        }
    })

    // window.location.href = "/"
}
