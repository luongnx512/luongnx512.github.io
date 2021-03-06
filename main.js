$("#div-chat").hide();
const socket = io("https://luongnx-webrtc.herokuapp.com/");
socket.on("DANH_SACH_ONLINE",arrUserInfo => {
    $("#div-chat").show();
    $("#div-dang-ki").hide();
    arrUserInfo.forEach(user => {
        const { ten, peerId } = user;
        console.log(user)
        $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
    })
    socket.on("CO_NGUOI_DANG_KY_MOI",user => {
        const { ten, peerId } = user;
        $("#ulUser").append(`<li id="${peerId}">${ten}</li>`);
    });
});
socket.on("DANG_KY_THAT_BAI", () => alert("Vui long chon user khac"));
socket.on("AI_DO_NGAT_KET_NOI", peerId => {
    $(`#${peerId}`).remove();
});

$("#ulUser").on('click','li',function(){
    const id = $(this).attr('id');
    openStream()
    .then(stream => {
        playStream("localStream",stream);
        const call = peer.call(id,stream);
        call.on('stream',remoteStream => playStream("remoteStream",remoteStream));
    })

})


function openStream(){
    const config = {audio: true,video: true};
    return navigator.mediaDevices.getUserMedia(config);

}
function playStream(idVideoTag,stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream;
    video.play();
}


var customConfig;
  
// // Call XirSys ICE servers
// $.ajax({
//   url: "http://global.xirsys.net",
//   data: {
//     ident: "luongnx512",
//     secret: "06993412-5db5-11e7-a9fd-f11954654461",
//     domain: "luongnx512.github.io",
//     application: "default",
//     room: "default",
//     secure: 1
//   },
//   success: function (data, status) {
//     // data.d is where the iceServers object lives
//     customConfig = data.d;
//     console.log(customConfig);
//   },
//   async: false
// });



const peer = new Peer({
    key: 'peerjs',
    host: 'test-peerjs-server.herokuapp.com',
    secure: true, 
    port: 443,
   });
// const peer = new Peer({key: 'n2tak13djk29y66r'});


peer.on("open",id => {
    $("#my-peer").append(id);
    $("#btnSignup").on("click",()=>{    
    const username = $("#txtUsername").val();
    socket.emit("NGUOI_DUNG_DANG_KY",{ten:username,peerId: id});
})
});

//Caller 
$("#btnCall").on("click",()=>{
    const id = $("#remoteId").val();
    openStream()
    .then(stream => {
        playStream("localStream",stream);
        const call = peer.call(id,stream);
        call.on('stream',remoteStream => playStream("remoteStream",remoteStream));
    })
})


//Callee
peer.on("call",call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream("localStream",stream);
        call.on('stream',remoteStream => playStream("remoteStream",remoteStream));
    })
})