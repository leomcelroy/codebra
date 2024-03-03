import { render } from "lit-html";
import { view } from "./view.js"

import { addCaching } from "./events/addCaching.js";
import { addWindowResize } from "./events/addWindowResize.js";
import { addDropUpload } from "./events/addDropUpload.js";
import { addDownload } from "./events/addDownload.js";
import { addUpload } from "./events/addUpload.js";
import { addConnect } from "./events/addConnect.js";
import { addRepl } from "./events/addRepl.js";

export function init(state) {
	
	state.actions = {
		render: (hard = false) => {
			if (hard) render(view(state), document.body);
			else window.requestAnimationFrame(() => render(view(state), document.body));
		}
	}

	state.actions.render(true);

	addCaching(state);
	addWindowResize(state);
	addDropUpload(state);
	addDownload(state);
	addUpload(state);
	addConnect(state);
	addRepl(state);

	// const canvas = document.querySelector("canvas");

	// const observer = new ResizeObserver(e => {
	// 	console.log(e);
	// });

	// observer.observe(canvas);

}