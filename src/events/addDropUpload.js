import { createListener } from "../createListener.js";
import { pauseEvent } from "../pauseEvent.js"

export function addDropUpload(state) {
  const listener = createListener(document.body);

  listener("drop", "", function(evt) {    
    let dt = evt.dataTransfer;
    let files = dt.files;

    document.querySelector(".drop-modal").classList.add("hidden"); 

    upload(files, state);

    pauseEvent(evt);
  });

  listener("dragover", "", function(evt) {
    document.querySelector(".drop-modal").classList.remove("hidden");   
    pauseEvent(evt);
  });

  listener("mouseleave", "", function(evt) {
    document.querySelector(".drop-modal").classList.add("hidden");   
  });
}

function upload(files, state) {
  const cmEl = document.querySelector("cm-editor");
  const cm = cmEl.codemirror;
  console.log({ cmEl, cm });

  const file = files[0];
  const fileName = file.name.split(".");
  const name = fileName[0];
  const extension = fileName[fileName.length - 1];

  var reader = new FileReader();
  reader.readAsText(file);

  reader.onloadend = event => {
    let text = reader.result;

    if (extension === "py") {
      const end = cm.state.doc.toString().length;
      cm.dispatch({
        changes: { from: 0, to: end, insert: text }
      });
    } else {
      throw Error("Unknown extension:", extension);
    }
  };
};
