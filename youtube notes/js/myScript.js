// myVariable = 10;

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function hello() {
    console.log("Hello");
    console.log(document.getElementsByTagName("video")[0].currentTime);
}

// setInterval(function(){
//   hello();
// }, 1000);


// setInterval(function(){$.ajax({
//     type: 'POST',
//     url: 'http://127.0.0.1:8000/vbook/time/',
//     data: {
//         rxn: document.getElementsByTagName("video")[0].currentTime,
//         // csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(),
//     },
//     success: function(response) {
//         rxn = '';
//         // console.log('Worker');
//         // new_reactions = response.rxn
//         console.log(response.rxn)
//         // diff = new_reactions.length - reactions.length
//         // if (diff > 0)
//         //     displayReactions(new_reactions, diff);
//         // reactions = new_reactions
//     }
//     // complete: function() {
//     //     setTimeout(worker, 5000)
//     // }
// });
// }, 1000);

var userID = '';
var reactions = [];
var users = [];

function displayReactions(reactions, diff) {
    console.log(reactions)
    if (diff > 0) {
        // Display last element of the list reaction, userID
        console.log(reactions[reactions.length - 1][0], reactions[reactions.length - 1][1]);
    }
}

function updateTimes(times) {
    console.log(times);
    for (var key in times) {
        if (key != userID) {
            totalTime = document.getElementsByTagName("video")[0].duration;
            currentTime = times[key]['time'];
            time = (100 * currentTime) / totalTime;
            color = times[key]['color'];
            if ($("#" + key).length != 0) {
                $('#' + key).remove();
                $('.ytp-progress-list').append("<div class='ytp-play-progress' id='"+ key +"' style='left:" + time + "%; transform: scaleX(0.01);background-color:yellow;height:1.5em; width:100em; border-radius:50%'></div>");                
            }
            else{
                $('.ytp-progress-list').append("<div class='ytp-play-progress' id='"+ key +"' style='left:" + time + "%; transform: scaleX(0.01);background-color:yellow; height:1.5em; width:100em; border-radius:50%'></div>");
            }
            
        }


    }


}

function pollMain(userID, color) {
    setInterval(function() {
        $.ajax({
            type: 'POST',
            url: 'http://127.0.0.1:8000/vbook/time/',
            data: {
                time: document.getElementsByTagName("video")[0].currentTime,
                videoURL: window.location.href,
                videoTitle: document.getElementById('eow-title').innerHTML.trim(),
                id: userID,
                color: color
            },
            success: function(response) {
                times = JSON.parse(response.times);
                new_reactions = response.rxn;
                updateTimes(times);
                diff = new_reactions.length - reactions.length;
                if (diff > 0)
                    displayReactions(new_reactions, diff);
                reactions = new_reactions;
            }
        });
    }, 1000);
}

function pollUserID() {
    console.log("Polling for UserID");
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8000/vbook/userID/',
        success: function(response) {
            newUsers = response.users;
            if (newUsers.length > users.length) {
                userID = newUsers[newUsers.length - 1]['userID'];
                color = newUsers[newUsers.length - 1]['color'];
                console.log("Connection Established your ID is------ ", userID);
                pollMain(userID, color);
            }
        },
        complete: function(response) {
            if (userID === '')
                setTimeout(pollUserID, 5000);
        }
    });
}

function main() {
    console.log("main");
    $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:8000/vbook/userID/',
        success: function(response) {
            users = response.users;
            console.log("Initial User List", users);
            setTimeout(5000);
            pollUserID();
        }
    });
    // Step1 : Poll until user id is fixed
    // Step2 : Poll for users and times

}

main()
