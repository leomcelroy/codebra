import { createListener } from "../createListener.js";
import { download } from "../download.js";

export function addDownload(state) {
	const listen = createListener(document.body);

	const cmEl = document.querySelector("cm-editor")
	const cm = cmEl.codemirror;

	listen("click", ".download-trigger", e => {
		const code = cm.state.doc.toString();
		const name = prompt("please input a file name");
		download(`${name}.py`, code);
	});
}
