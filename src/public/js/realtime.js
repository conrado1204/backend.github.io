const nav = document.querySelector("#nav");
const userName = document.querySelector(".userName");
const socket = io();
let nameUser = "";

const chatMessage = document.querySelector(".chatMessage");
let idUser = "";
const messageInnerHTML = (data) => {
  let message = "";

  for (let i = 0; i < data.length; i++) {
    if (data[i].info === "connection") {
      message += `<p class="connection">${data[i].message}</p>`;
    }
    if (data[i].info === "message") {
      message += `
        <div class="messageUser">
            <h5>${data[i].name}</h5>
            <p>${data[i].message}</p>
        </div>
        `;
    }
  }

  return message;
};

socket.on("userConnection", (data) => {
  chatMessage.innerHTML = "";
  const connection = messageInnerHTML(data);
  chatMessage.innerHTML = connection;
});

const inputMessage = document.getElementById("inputMessage");
const btnMessage = document.getElementById("btnMessage");

btnMessage.addEventListener("click", (e) => {
  e.preventDefault();
  socket.emit("userMessage", {
    message: inputMessage.value,
  });
});

socket.on("userMessage", (data) => {
  chatMessage.innerHTML = "";
  const message = messageInnerHTML(data);
  chatMessage.innerHTML = message;
});

inputMessage.addEventListener("keypress", () => {
  socket.emit("typing", { nameUser });
});

const typing = document.querySelector(".typing");
socket.on("typing", (data) => {
  typing.textContent = `${data.nameUser} escribiendo...`;
});

function showHide() {
  let chat = document.getElementsByClassName("chat")[0];
  if (chat.style.visibility === "hidden") {
    chat.style.visibility = "visible";

    Swal.fire({
      title: "Ingrese su Nombre",
      input: "text",
      width: "25rem",
      position: "top-end",
      inputAttributes: {
        autocapitalize: "on",
      },
      showCancelButton: false,
      confirmButtonText: "Ingresar",
    }).then((result) => {
      userName.textContent = result.value;
      nameUser = result.value;
      socket.emit("userConnection", {
        user: result.value,
      });
    });
  } else {
    chat.style.visibility = "hidden";
  }
}

/*function showHide() {
  let chat = document.getElementsByClassName("chat")[0];
  if (chat.style.visibility === "hidden") {
    chat.style.visibility = "visible";
  } else {
    chat.style.visibility = "hidden";
  }
}*/

/*function showHide() {
  let chatContainer = document.getElementsByClassName("chat-container")[0];
  let chat = document.getElementsByClassName("chat")[0];
  let chatContent = chat.scrollHeight;
  
  if (chatContainer.style.height === "0px" || chatContainer.style.height === "") {
    chatContainer.style.height = chatContent + "300px";
    
    Swal.fire({
      title: "Ingrese su Nombre",
      input: "text",
      inputAttributes: {
        autocapitalize: "on",
      },
      showCancelButton: false,
      confirmButtonText: "Ingesar",
    }).then((result) => {
      userName.textContent = result.value;
      nameUser = result.value;
      socket.emit("userConnection", {
        user: result.value,
      });
    });
  } else {
    chatContainer.style.height = "0px";
  }
}*/

/*function showHide(){
  let chat = document.getElementsByClassName("chat")[0];
  if (chat.style.visibility === "hidden" || chat.style.height ==="" ) {
    chat.style.visibility = "visible";
  } else {
    chat.style.visibility = "hidden";
  }
};*/
