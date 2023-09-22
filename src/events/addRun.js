import { createListener } from "../createListener.js";

export function addRun(state) {
	const listen = createListener(document.body);

	const cmEl = document.querySelector("cm-editor")
	const cm = cmEl.codemirror;

	state.actions.run = (render = true) => {
		const code = cm.state.doc.toString();
		const result = runCode(code);
		state.turtles = result.turtles;
		if (render) state.actions.render();
		state.machineRunning = false;
	}

	listen("click", ".run-trigger", e => {
		state.actions.run();
	});

	window.addEventListener("keydown", e => {
	    const isEnter = e.keyCode === 13;

	    if (isEnter && e.shiftKey) {
	      state.actions.run();
	      e.preventDefault();
	    }
	  })
}



function runCode(str) {

	const INCLUDED = {}

	const fn = new Function(...Object.keys(INCLUDED), str);
	fn(...Object.values(INCLUDED));

	return { }
}