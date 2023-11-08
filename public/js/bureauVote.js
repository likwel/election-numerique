const searchParams = (new URL(document.location)).searchParams

let request = ""
if(searchParams.has("id") && searchParams.get("id")){
    request = "/getBureau-de-vote/"+searchParams.get("id")
}else{
    request = "/getAllbureau-de-vote"
    runSpinner()
}

fetch(request).then(response => response.json())
    .then(data => {

        let lis = ''

        if (data.length > 0) {

            for (let electeur of data) {

                // console.log(electeur);
                lis += `<tr>
                            <td style="width:20px;">${electeur.id_fokontany}</td>
                            <td>${electeur.fokontany}</td>
                            <td>${electeur.commune}</td>
                            <td>${electeur.district}</td>
                            <td>${electeur.region}</td>
                            <td>${electeur.province}</td>
                        </tr>`
            }

            document.querySelector("#inner-bureau-electorale").innerHTML = lis

            // new DataTable('#mon-table');

        } else {

            document.querySelector("#inner-bureau-electorale").innerHTML = "<h3 style='color:red;margin:15px;'>Aucun électeur enregistré pour le moment.</h3>"
        }

        $('#mon-table').DataTable({
            "language": {
                url: '/static/mg-MG.json',
            }
        });

})
