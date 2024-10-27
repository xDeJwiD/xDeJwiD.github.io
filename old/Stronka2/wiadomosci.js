//Create an array where the message along with it's ID will be stored.
let message = [];

// This fuction will enables us to add the message to the DOM
function addMessage(text){
//Object where message will be stored
 const chat = {
      text,
     id: Date.now()
 }

     message.push(chat);
    console.log(message);
    }   




    //Create event listener to detect when a message has been submitted
    const form = document.querySelector('.input');
    addEventListener('submit', event => {
     event.preventDefault();

    //input to save the message itself
    const input = document.querySelector('.input');

    //This helps us to detect empty messages and ignore them
     const text = input.value.trim();

    if(text !== ''){
        addMessage(text);
        input.value = '';
        input.focus();

       }
        });




    function addMessage(text){
    //Object where message will be stored
    const chat = {
        text,
        id: Date.now()
    }

    message.push(chat);

    //Render message to the screen
    const list = document.querySelector('.tabContainer .tabPanel #czat1-mid');
    list.insertAdjacentHTML('beforeend', 
        `<div class='d'>
         <p class="message-item" data-key="${chat.id}">
                <span>${chat.text}</span>
            </p>
        </div>`
    );
    $('#czat1-mid').animate({scrollTop: $('#czat1-mid div.d:last-child').offset().top});
    }
