//初期化(cssでもできるはず)
var existingDataConn = null;
let g_theirId =""  ;
function DataConnect(theirId) {
    
} 
function DataClose(theirId) {
    
}
function DataRegistered(id){
    var element = document.getElementById(id);
    if(element!=null){
        var element = document.createElement('div');
		element.id = id;
		document.body.appendChild(element);
    }
    existingRightCall.on("data",data=>{element.innerText = data});
}
//送信処理
function DataSend(msg) {
    if(existingRightCall==null){
        DataConnect(g_theirId);
        if(existingRightCall==null)return;
    }
    existingRightCall.send(msg);
}
function DataReceived(){
    
}
