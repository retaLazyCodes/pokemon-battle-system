console.log('working');

let turn = 0;



function attack1() {

	console.log('attacked with first attack');
}

function attack2() {
	console.log('attacked with second attack');
}

function attack3() {
	console.log('attacked with third attack');
}
function attack4() {
	console.log('attacked with fourth attack');
}

document.getElementById('attack1').addEventListener('click', attack1);
document.getElementById('attack2').addEventListener('click', attack2);
document.getElementById('attack3').addEventListener('click', attack3);
document.getElementById('attack4').addEventListener('click', attack4);