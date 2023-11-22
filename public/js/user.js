function login(){

    let email = document.querySelector("#email-user").value
    let password = document.querySelector("#password-user").value

    let data = {
        email: email,
        password: password 
    }
    //console.log(data);

    if(email != "" && password !=""){
        fetch('/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response=>{
            if(response.ok && response.status == 200){
                location.href ="/"
            }
            if(!response.ok && response.status == 401){
                // location.href ="/login"

                writeFlush(document.querySelector(".form-login"), "error", "Mot de passe incorrect!")

                document.querySelector("#email-user").value = ""
                document.querySelector("#password-user").value =""
    
            }
        })
    }else{
        writeFlush(document.querySelector(".form-login"), "error", "Champs invalides!")
    }

    
}

function register(){

    let email = document.querySelector("#email-user").value
    let password = document.querySelector("#password-user").value
    let username = document.querySelector("#username-user").value

    let data = {
        username: username,
        email: email,
        password: password
    }
    //console.log(data);

    if(email && password && username){

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response=>{
            if(response.ok && response.status == 200){
                location.href ="/login"
            }

            if(!response.ok && response.status == 409){
                document.querySelector("#email-user").value =""
                writeFlush(document.querySelector(".form-login"), "warning", "Adresse email déjà utilisé!")
            }

            if(!response.ok && response.status == 410){
                document.querySelector("#username-user").value =""
                writeFlush(document.querySelector(".form-login"), "warning", "Nom d'utilisateur déjà utilisé!")
            }

        })
    }else{
        writeFlush(document.querySelector(".form-login"), "error", "Champs invalides!")
    }

}

if(location.href.includes("/login")){
    document.querySelector("#password-user").addEventListener("keyup", (event)=>{
        if (event.keyCode == 13){
            login()
        }
    })
    
    document.querySelector("#email-user").addEventListener("keyup", (event)=>{
        if (event.keyCode == 13){
            login()
        }
    })
}

if(location.href.includes("/signup")){
    document.querySelector("#password-user").addEventListener("keyup", (event)=>{
        if (event.keyCode == 13){
            register()
        }
    })
    
    document.querySelector("#email-user").addEventListener("keyup", (event)=>{
        if (event.keyCode == 13){
            register()
        }
    })
    document.querySelector("#username-user").addEventListener("keyup", (event)=>{
        if (event.keyCode == 13){
            register()
        }
    })
}

/**
 * @constructor
 * @param {*} div 
 * @param {*} type 
 * @param {*} message 
 */
function writeFlush(parent, type, message){

    let err = document.createElement("div")

    let ico =""
    let color =""
    let border =""
    let bgColor =""
    switch(type){
        case "error" : {
            ico = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'
            color = "#58151c"
            border = "#f1aeb5"
            bgColor = "#f8d7da"
            break;
        }
        case "success" : {
            ico = '<i class="fa fa-check-circle" aria-hidden="true"></i>'
            color = "#0a3622"
            border = "#a3cfbb"
            bgColor = "#d1e7dd"
            break;
        }
        case "info" : {
            ico = '<i class="fa fa-info-circle" aria-hidden="true"></i>'
            color = "#055160"
            border = "#9eeaf9"
            bgColor = "#cff4fc"
            break;
        }
        case "question" : {
            ico = '<i class="fa fa-question-circle" aria-hidden="true"></i>'
            color = "#052c65"
            border = "#9ec5fe"
            bgColor = "#cfe2ff"
            break;
        }
        case "warning" : {
            ico = '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i>'
            color = "#664d03"
            border = "#ffe69c"
            bgColor = "#fff3cd"
            break;
        }
        default : {
            ico = '<i class="fa fa-info-circle" aria-hidden="true"></i>'
            color = "#495057"
            border = "#e9ecef"
            bgColor = "#fcfcfd"
        }
    }

    err.innerHTML = `
    <div class="flush ${type}" style="color :${color};border : 1px solid ${border}; background-color : ${bgColor}; ">
        <span class="closebtn-flush" onclick="this.parentElement.style.display='none';">&times;</span>
        ${ico} ${message}.
    </div>
    `
    parent.appendChild(err)

    if(document.querySelector(".flush")){
        setTimeout(()=>{
            document.querySelector(".flush").remove()
        }, 3000)
    }
}