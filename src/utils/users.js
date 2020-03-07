const users = [];

const addUser = ({id , username , room }) => {
    //Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //Validate the data
    if(!username || ! room){
        return {
            error : 'Username and room are required !'
        }
    }

    //Check the existing user
    const exisingUser = users.find((user)=> {
        return user.room === room && user.username === username
    })

    if(exisingUser){
        return {
            error : 'User is in use !'
        }
    }

    //Add user
    const user = {id , username , room }
    
    users.push(user);
    return {user};
};

const removeUser = (id) => {
    const userIndex = users.findIndex((user)=> user.id === id);

    if(userIndex !== -1) {
        return users.splice(userIndex,1)[0];
    }
};

const getUser = (id) =>{
    const user = users.find((user)=>{
        return user.id === id
    });

    if(user){
        return user;
    }
};

const getsUserInRoom = (room) => {
    
    room = room.trim().toLowerCase()

    const user = users.filter((user)=> {
        return user.room === room
    });

    if(user){
        return user;
    }
};


module.exports = {
    getUser,
    removeUser,
    getsUserInRoom,
    addUser
}