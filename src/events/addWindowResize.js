import { createListener } from "../createListener.js";
import { pauseEvent } from "../pauseEvent.js";

export function addWindowResize(state) {
  const listener = createListener(document.body);

	let moveVerticalBar = false;

	listener("mousedown", ".separator", e => {
		moveVerticalBar = true;

    document.body.style.cursor = "col-resize";
	})

	listener("mousemove", "", (e) => {
		if (!moveVerticalBar) return;

		let x = e.clientX/window.innerWidth * 100;
		if (x === 0) return;

		const minX = 1;
		const maxX = 99;

		if (x < minX) x = minX;
		if (x > maxX) x = maxX;

		document.documentElement.style.setProperty("--editor-width", `${x}%`);

		pauseEvent(e);
	})

	listener("mouseup", "", e => {
		if (moveVerticalBar) state.actions.render();
		moveVerticalBar = false;
    document.body.style.cursor = null;
	})
}