
runSpinner()

fetch('/getAllbureau-de-vote').then(response => response.json())
    .then(data => {

        let lis = ''

        if (data.length > 0) {

            for (let electeur of data) {

                // console.log(electeur);
                lis += `<tr>
            <td style="width:20px;">${electeur.id}</td>
            <td>${electeur.name}</td>
            <td>${electeur.commune}</td>
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
