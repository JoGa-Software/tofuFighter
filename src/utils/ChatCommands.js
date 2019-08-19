var commandList = {
    help: /\/help/,
    name: /^(\/name ){1}/,
    image: /^(\/img ){1}/,
    clear: /\/clear/,
}

function checkForCommands(message) {

    Object.keys(commandList).forEach((key) => {
		var value = commandList[key]
		
		//check if a command has been found
        if (value.test(message)){
            // console.log(`got ${key} command`)

            switch(key) {
                case 'help':
                    message = helpCommand()
                    return
                case 'name':
                    message = nameCommand(value, message)
                    return
                case 'image':
                    return
                case 'clear':
                    message = clearCommand()
                    return 
            }

        }
    })
    return message;
}

function helpCommand(){
    return ''//'[]visit: http://jogasoftware.com/#/tofuFighter for a list of commands'
}

function nameCommand(regex, message) {
    var name = message.replace(regex, "").trim()
    
    if (name.length > 10) {
        return "[Command Error]: NAME must be 10 characters or less"
    }

    //set the new name
    game.netName = name;

    return "Changed name to " + name
}


function clearCommand() {
    var chatDisplay = document.getElementById("chatDisplay")
    chatDisplay.innerHTML = ''
    return ''
}