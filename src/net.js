

netPlayers = {};

function netMessage(resp)
{

    if (resp['event'] == 'hi')
    {
        game.user_id = resp['id'];
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
