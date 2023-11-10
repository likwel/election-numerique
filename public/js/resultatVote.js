// 

let list_resultat = JSON.parse(resultat_stringify.replaceAll('&#34;', "\""))

if (list_resultat.length > 0) {

    let somme = 0
    for (let res of list_resultat) {

        // console.log(res);
        somme+=parseFloat(res.resultat)
        console.log(somme);
        fetch('/getOneCandidatById/' + res.candidat_id)
            .then(data => data.json())
            .then(result => {

                let y = parseFloat(res.resultat) * 100 / somme

                let x =Math.round(y*100)/100

                let lis = `<tr>
                <td style="width:9%;" class="td-resultat"><h1>${result.numero.toString().padStart(2, '0')}</h1></td>
                <td style="width:9%;" class="td-resultat"><img class="photo-resultat" src="${result.photo}"></td>
                <td style="width:9%;" class="td-resultat"><h1>${result.nom}</h1></td>
                <td style="width:9%;" class="td-resultat"><h1>${res.resultat}</h1></td>
                <td style="width:9%;" class="td-resultat"><h1>${x} %</h1></td>
                </tr>`
                document.querySelector("#inner-resultat-electorale").innerHTML += lis
        })
        
    }
}else{
    document.querySelector("#inner-resultat-electorale").innerHTML = `<tr class="odd add-border"><td valign="top" colspan="5" class="dataTables_empty center aucun-result">Mbola tsy misy valim-pifidianana voatahiry!</td></tr>`
    
}
