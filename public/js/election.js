
window.onload = () => {
    fetch("/getAllCandidat")
        .then(response => {
            return response.json();
        }).then(candidats => {
            // console.log(jsondata)
            let ul1 = ""
            let ul2 = ""
            let iter = 0
            for (let candidat of candidats) {

                if (iter <= 6) {
                    ul1 += `
                    <li class="candidat">
                        <div class="items-candidat">
                            <div class="numero-candidat">
                                <p >${candidat.numero.toString().padStart(2, '0')}</p> 
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
                                <p >${candidat.numero.toString().padStart(2, '0')}</p> 
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

        console.log(deja);

    if(deja == 'exist'){
        
        document.querySelector("#modal").classList.remove("d-none");
        document.querySelector("#modal").classList.add("op-1");
        document.querySelector("body").classList.add("modal-open");

        let url_string = location.href;
        let url = new URL(url_string);
        let electeur = url.searchParams.get("id");

        fetch("/getOneVoteById/"+electeur)
        .then(electeurd=>electeurd.json())
        .then(el=>{

            document.querySelector("#confirm-candidat").classList.add("center")

            document.querySelector("#confirm-candidat").innerHTML = `
            <div class="div-success">
                <svg style="width:100%;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="IconChangeColor" height="100" width="100"><path d="M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM17 15.74L15.74 17 12 13.26 8.26 17 7 15.74 10.74 12 7 8.26 8.26 7 12 10.74 15.74 7 17 8.26 13.26 12 17 15.74z" id="mainIconPathAttribute" fill="#fa0000"></path></svg>
                <label class="text-danger">Miala tsiny tompoko!</label>
                <p>Ianao dia efa nifidy ka tsy afaka mifidy intsony</p>
                <p>Daty sy ora nifidiananao :  ${el.createdAt}</p>
            </div>
            `

            setInterval(()=>{
                closeAlert()
                window.location.href = "/"
            }, 3000)
        })
    }
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
                        <button class="candidat-oui" onclick="accepter(${candidat.id}, '${candidat.nom}')">Eny</button>
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

function accepter(id, nom) {
    // console.log(JSON.parse(candidat));

    let url_string = location.href;
    let url = new URL(url_string);
    let electeur = url.searchParams.get("id");

    closeAlert()

    let data = {
        "electeur_id": electeur,
        "candidat_id": id,
        "candidat_nom": nom
    }

    fetch('/election/send', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {

        if (res.ok && res.status == 200) {

            document.querySelector("#modal").classList.remove("d-none");
            document.querySelector("#modal").classList.add("op-1");
            document.querySelector("body").classList.add("modal-open");

            fetch("/getOneElecteurById/"+electeur)
            .then(electeurd => electeurd.json())
            .then(el=>{

                document.querySelector("#confirm-candidat").classList.add("center")

                document.querySelector("#confirm-candidat").innerHTML = `
                <div class="div-success">
                    <svg style="width:100%;" fill="#12B886" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 64 64" width="100px" height="100px"><path d="M32,6C17.641,6,6,17.641,6,32c0,14.359,11.641,26,26,26s26-11.641,26-26C58,17.641,46.359,6,32,6z M29.081,42.748	l-10.409-9.253l2.657-2.99l7.591,6.747L44,21l3.414,3.414L29.081,42.748z"/></svg>
                    <label class="text-success">${el.nom}!</label>
                    <p>Misaotra anao nanefa ny adidy, misaotra anao naneho ny safidy.</p>
                    <p>Masina ny tanindrazana, masina ny safidy.</p>
                </div>
                `

                setInterval(()=>{
                    closeAlert()
                    window.location.href = "/"
                }, 3000)
            })

            
            // window.location.href = "/election"
        } 
        // else {
        //     window.location.href = "/election"
        // }
    })

    // window.location.href = "/"
}
