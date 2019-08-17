

netPlayers = {};

function netMessage(resp)
{

    if (resp['event'] == 'hi')
    {
        game.user_id = resp['id'];
        game.netName = `Anon_${game.user_id}`
        game.connected = true;
        game.tofu.color = COLORS[game.user_id % COLORS.length];
    }
    else
    {
        var user = resp['id'];
        if (resp['event'] == 'pos' || resp['event'] == 'shoot')
        {
            // find the netplayer or create them		
            if (!netPlayers[user])
            {
                var player = new GSNetPlayer(user);
                entities.push(player);
                netPlayers[user] = player;
            }

            // update physics
            netPlayers[user].netUpdate(resp);
        
            // pew pew pew
            if (resp['event'] == 'shoot')
            {
                netPlayers[user].shoot(resp['side']);
            }
        }
        else if (resp['event'] == 'die')
        {
            if (netPlayers[user])
                netPlayers[user].die();
        }
        else if (resp['event'] == 'chatMessage') 
        {
            //get a reference to the chat display
            var chatDisplay = document.getElementById("chatDisplay")
            
            //remove the oldest messages 
            if (chatDisplay.children.length > 10) {
                chatDisplay.removeChild(chatDisplay.children[0])
            }

            var pad2 = function(number) {
                return (number < 10 ? '0' : '') + number
            }

            //get the time string
            var currentdate = new Date(); 
            var hours = currentdate.getHours()
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours%12
            hours = hours ? hours : 12
            var timeString = `${pad2(hours)}:${pad2(currentdate.getMinutes())}${ampm}`

            //get the color
            var color;
            if (game.user_id == user) {
                color = game.tofu.color
            }else {
                color = netPlayers[user].color
            }
            console.log(`rgb(${color[0]*255.0}, ${color[1]*255.0}, ${color[2]*255.0})`)
            //add the new message
            var li = document.createElement("LI");
            li.innerHTML = `
                <font style="color:rgb(${color[0]*255.0}, ${color[1]*255.0}, ${color[2]*255.0})">${resp["netName"]}(${timeString}):</font> ${resp["message"]}
            `
            chatDisplay.appendChild(li)
        }
        else
        {
            // unknown event
            alert("unknown event: " + resp['event']);
        }
    }
}

function netConnect()
{
    game.socket = io();
    game.socket.on('disconnect', function(){game.connected = false;});
    game.socket.on('message', netMessage);
}
