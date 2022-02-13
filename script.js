let userNamePost = {
    name: null
};
let arrayMessages = [];
let postMessage = {};

catchName();
pickUpMensages();
setInterval(pickUpMensages, 3000);
setInterval(sendPeriodicNameRequest,5000);


// Requisiçoes para o servidor relacionadas ao nome do usuario
// Recebe o nome do usuario ao abrir a pagina
function catchName() {
    let userName = null;
    if (userNamePost.name === null) {
        userName = prompt("Qual seu nome?");
    }
    else if (userNamePost.name !== null) {
        userName = prompt("Este nome de usuario já está sendo utilizado, por favor forneça outro.")
    }
    userNamePost = {
        name: userName
    }
    sendInicialNameRequest();
}
// Envia a requisição incial ao usuario
function sendInicialNameRequest() {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants ", userNamePost);
    promisse.then(treatSuccess);
    promisse.catch(treatUserNameFailure);
}
// Trata o erro de usuario já existente e pede novamente o nome
function treatUserNameFailure(error) {
    const statusCode = error.response.status;
    console.log(statusCode);
    catchName();
}
// Envia o nome do usuario para o endereço de status
function sendPeriodicNameRequest() {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", userNamePost);
    promisse.then(treatSuccess);
    promisse.catch(treatFailure);
}


// Requisiçoes relacionadas a receber as mensagens do servidor
// Pede ao servidor as mensagens
function pickUpMensages() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promisse.then(treatSuccesMensages);
    promisse.catch(treatFailure);
    pickUpOnlineUsers();
}
// Adiciona as mensages a uma variavel
function treatSuccesMensages(response) {
    arrayMessages = response.data;
    formatMensage();
}
// Trata o formato no qual as mensagens devem ser apresentadas
function formatMensage() {
    const messageHtml = document.querySelector("main");
    for (let i = 0; i < arrayMessages.length; i++) {

        if (arrayMessages[i].type === "status") {
            messageHtml.innerHTML += ` 
                <div class="chat ${arrayMessages[i].type}">
                <p class="time">(${arrayMessages[i].time}) &nbsp;</p>
                <p class="from">${arrayMessages[i].from} &nbsp;</p>
                <p class="text">${arrayMessages[i].text}</p>
                </div>
                `}

        if (arrayMessages[i].type === "message") {
            messageHtml.innerHTML += ` 
                <div class="chat ${arrayMessages[i].type}">
                <p class="time">(${arrayMessages[i].time}) &nbsp;</p>
                <p class="from">${arrayMessages[i].from} &nbsp;</p>
                <p> para &nbsp<span class="to">${arrayMessages[i].to}</span> &nbsp;</p>
                <p class="text">${arrayMessages[i].text}</p>
                </div>
                `}

        if (arrayMessages[i].type === "private-message") {
            messageHtml.innerHTML += ` 
                <div class="chat ${arrayMessages[i].type}">
                <p class="time">(${arrayMessages[i].time}) &nbsp;</p>
                <p class="from">${arrayMessages[i].from} &nbsp;</p>
                <p> reservadamente para &nbsp <span class="to">${arrayMessages[i].to}</span> &nbsp;</p>
                <p class="text">${arrayMessages[i].text}</p>
                </div>
                `}
    }
    scrollLastMessage();
}
// Faz com que a ultima mensagem enviada apareca no final do chat
function scrollLastMessage() {
    const lastMessage = document.querySelector("main div:last-of-type");
    lastMessage.scrollIntoView();
}


// Requisições relacionadas a enviar mensagens ao servidor
// pega o valor do input 
function pickUpInputMessages(){
    const input = document.querySelector("footer input").value;
    treatPostMessage(input);
    clearInput();
}
// Pega o texto do input ao pressionar enter
document.addEventListener("keypress", function(e) {
    if(e.key === 'Enter') {
        const button = document.querySelector("footer img"); 
        button.click();
    }
});
// Formata o objeto mensagem a ser enviado
function treatPostMessage(textoMensagem) {
    postMessage = {
        from: userNamePost.name,
        to: "Todos",
        text: textoMensagem,
        type: "message"
    }
    sendMessage()
}
// Envia a mensagem
function sendMessage() {
    const promisse = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", postMessage);
    promisse.then(treatSuccess);
    promisse.catch(treatFailure);
}
// Limpa o input apos enviada a mensagem
function clearInput() {
    const input = document.querySelector("footer input");
    input.value = "";
}


// Verificações de requisiçoes ao servidor
// Trata caso a requisição seja bem sucedida
function treatSuccess(response) {
    const statusCode = response.status;
}
// Trata caso a requisiçao não seja bem sucedida
function treatFailure(error) {
    const statusCode = error.response.status;
    console.log(statusCode);
}


// Requisições relacionadas a lista de participantes
function pickUpOnlineUsers() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    promisse.then(treatSuccesOnlineUsers);
    promisse.catch(treatFailure);
}
function treatSuccesOnlineUsers(users) {
    let onlineUsers = users.data;
    console.log(onlineUsers);
}

















// Efeitos do menu lateral
function openSideMenu() {
    const sideMenuBackground = document.querySelector(".side-menu-background");
    const sideMenu = document.querySelector(".side-menu");
    const sideMenuAll =document.querySelector(".side-menu-all");
    sideMenuAll.style.transition = "visibility 0s";
    sideMenuAll.style.visibility = "visible";
    sideMenu.style.width = "69%";
    sideMenuBackground.style.width = "100%";
    setTimeout(showMenuText, 700);
}
function closeSideMenu(element) {
    const sideMenuBackground = document.querySelector(".side-menu-background");
    const sideMenu = document.querySelector(".side-menu");
    const sideMenuAll =document.querySelector(".side-menu-all");
    sideMenu.style.width = "0";
    sideMenuBackground.style.width = "0";
    sideMenuAll.style.transition = "visibility 1s";
    sideMenuAll.style.visibility = "hidden";
    hiddenMenuText();
}
function showMenuText() {
    const sideMenu = document.querySelector(".side-menu");
    sideMenu.innerHTML = ` <h4>Escolha um contato para enviar mensagem:</h4> `
}
function hiddenMenuText() {
    const sideMenu = document.querySelector(".side-menu");
    sideMenu.innerHTML = "";
}