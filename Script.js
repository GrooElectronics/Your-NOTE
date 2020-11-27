class Note {
	constructor() {
		this.title = 'New NOTE';
		this.value = '';
		this.selected = false;
		this.id = "d" + Date.now().toString();
	}
	createNote() {
		const note = document.createElement('div');
		note.classList.add("note");
		note.innerHTML = `<p class="title1">${this.title}</p><button class="select-button"></button>`
		note.setAttribute('id', this.id);
		return note;
	}

}

class PopUpWindow {
	constructor(title, value) {
		this.title = title;
		this.value = value;
	}
	createPopUpWindow() {
		const popUpWindow = document.createElement("div");
		popUpWindow.classList.add("pop-up-window");
		const inputTitle = document.createElement('input');
		inputTitle.className = 'input-name';
		inputTitle.onchange = changeTitle;
		const textareaValue = document.createElement('textarea');
		textareaValue.className = 'textarea-value';
		textareaValue.onchange = changeValue;
		const button = document.createElement('button');
		button.className = 'button-put-off';
		button.onclick = close;
		button.innerHTML = 'OK';
		const deleteButton = document.createElement('button');
		deleteButton.className = 'del';
		deleteButton.onclick = deletePopUp;
		deleteButton.innerHTML = "Del";
		popUpWindow.appendChild(inputTitle);
		popUpWindow.appendChild(button);
		popUpWindow.appendChild(textareaValue);
		popUpWindow.appendChild(deleteButton);
		return popUpWindow;
	}
}

let notes = [];
let previous = null;
const classPopUpWindow = new PopUpWindow('pro', 'good');
const popUpWindow = classPopUpWindow.createPopUpWindow();
popUpWindow.style.display = 'none';
const body = document.querySelector("body");
body.appendChild(popUpWindow);

function pro() {
	const allNotes = document.getElementById('allNotes');
	const classNote = new Note();
	notes.push(classNote);
	render();
}

window.onclick = function(event) {
	if (event.target.classList.contains("note")) {
		const disabledChildren = allNotes.children;
		render();
		for (let i = 0; i < disabledChildren.length; i++) {
			disabledChildren[i].children[1].disabled = true;
		}
		const note = event.target;
		if (previous != null) {
			previous.classList.remove("selected");
		}
		note.classList.add("selected");
		for (let i = 0; i < notes.length; i++) {
			if (notes[i].selected === true) {
				notes[i].selected = false;
				break;
			}
		}
		for (let i = 0; i < notes.length; i++) {
			if (notes[i].id == note.id) {
				notes[i].selected = true;
				break;
			}
		}
		previous = note;
		popUpWindow.style.display = 'block';
		for (let i = 0; i < notes.length; i++) {
			if (notes[i].selected === true) {
				popUpWindow.children[0].value = notes[i].title;
				popUpWindow.children[2].value = notes[i].value;
				break;
			}
		}
		render();
	}
	if (event.target.classList.contains('button-put-off')) {
		popUpWindow.style.display = 'none';
		let children = allNotes.children;
		for (let i = 0; i < children.length; i++) {
			if (children[i].classList.contains("selected")) {
				children[i].classList.remove("selected");
			}
		}
		const disabledChildren = allNotes.children;
		render();
		for (let i = 0; i < disabledChildren.length; i++) {
			disabledChildren[i].children[1].disabled = false;
		}
	}
}

function changeTitle(event) {
	const p = previous.children[0];
	p.innerHTML	= event.target.value;
	for (let i = 0; i < notes.length; i++) {
		if (notes[i].selected === true) {
			if (event.target.value.length < 15) {
				notes[i].title = event.target.value;
			}
			else {
				notes[i].title = '';
				let value = event.target.value;
				for (let j = 0; j < 15; j++) {
					notes[i].title+=value[j];
				}
			}
			break;
		}
	}
}

function changeValue(event) {
	for (let i = 0; i < notes.length; i++) {
		if (notes[i].selected === true) {
			notes[i].value = event.target.value;
			break;
		}
	}
}

function render() {
	const allNotes = document.querySelector('#allNotes');
	allNotes.innerHTML = '';
	for (let i = 0; i < notes.length; i++) {
		allNotes.appendChild(notes[i].createNote());
	}
}

function deletePopUp() {
	let array = [];
	for (let i = 0; i < notes.length; i++) {
		if (notes[i].selected) {
			continue;
		}
		array.push(notes[i]);
	}
	notes = array;
	popUpWindow.style.display = 'none';
	render();
}

window.onload = function() {
	const storage = localStorage.getItem('notes');
	if (storage === null) {
		notes = [];
	}
	else {
		notes = JSON.parse(storage);
		for (let i = 0; i < notes.length; i++) {
			notes[i].__proto__= Note.prototype;
		}
		render();
	}
}

window.onunload = function() {
	for (let i = 0; i < notes.length; i++) {
		if (notes[i].selected) {
			notes[i].selected = false;
		}
	}
	localStorage.setItem("notes", JSON.stringify(notes));
}