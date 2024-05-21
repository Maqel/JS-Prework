function printMessage(msg){
  let div = document.createElement('div');
  div.innerHTML = msg;
  document.getElementById('message').appendChild(div);
}

function clearMessage(){
  document.getElementById('message').innerHTML = '';
}