const socket = io()

//Elements
$messageFormInput = document.querySelector("#txtMessage")
$messageFormInputButton = document.querySelector("#btnSubmit")
$messageFormSendLocationButton = document.querySelector('#send-location')
$messages = document.querySelector('#messages')


//Templates
messageTemplate = document.querySelector('#message-template').innerHTML;
locationMessageTemplate = document.querySelector('#location-message-template').innerHTML;
sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;


//Options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix : true});

const autoScroll = () => {
    //New Message Element 
    const $newMessage = $messages.lastElementChild;

    //Height of new message
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMesageHeight = $newMessage.offsetHeight + newMessageMargin;
    //Visible Height
    const visibleHeight = $messages.offsetHeight;

    //Container Height
    const containerHeight = $messages.scrollHeight;

    //How far I have scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if(containerHeight - newMesageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight;
    }

    // console.log($newMessage);
    // console.log(newMessageMargin);
    // console.log(visibleHeight);
    // console.log(containerHeight);
    // console.log(scrollOffset);
}

socket.on('message',(message)=>{
    console.log('message' + message);
    const html = Mustache.render(messageTemplate,{
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
});

socket.on('locationMessage',(objlocationMsg)=>{
    console.log(objlocationMsg)

    const html = Mustache.render(locationMessageTemplate,{
        username : objlocationMsg.username,
        url : objlocationMsg.url,
        createdAt : moment(objlocationMsg.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend',html);
    autoScroll();
});

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
    autoScroll();
});

$messageFormInputButton.addEventListener('click',(e)=>{
    e.preventDefault();
    
    $messageFormInputButton.setAttribute('disabled','disabled');

    const txtMessage = $messageFormInput.value;
    socket.emit('sendMessage',txtMessage,(error) => {

        $messageFormInputButton.removeAttribute('disabled');
        $messageFormInput.value = '';
        $messageFormInput.focus();


        if(error){
            return console.log(error);
        }

        console.log('Message was delivered!');
    });
});

$messageFormSendLocationButton.addEventListener('click',(e)=>{
    
    $messageFormSendLocationButton.setAttribute('disabled','disabled');
    
    if(!navigator.geolocation){
        return alert('Your browser does not support geolocation service!');
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);

        socket.emit('sendLocation',{'latitude':position.coords.latitude,'longitude':position.coords.longitude},(error)=>{
            
            if(error){
                return console.log(error);
            }
            console.log('Message was delivered!')
        });
    });

    

    $messageFormSendLocationButton.removeAttribute('disabled','disabled');
});

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href = '/';
    }
});