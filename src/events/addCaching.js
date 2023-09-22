export function addCaching(state) {
  const cache = window.localStorage.getItem("cache");
  const cmEl = document.querySelector("cm-editor");
  const cm = cmEl.codemirror;

  window.addEventListener("keydown", (e) => {
    const code = cm.state.doc.toString();
    window.localStorage.setItem("cache", code);
  });


  cm.dispatch({
    changes: { from: 0, insert: cache ?? "" }
  });

  const search = window.location.search;
  const file = new URLSearchParams(search).get("load");

  if (file) {
    let file_url = file;
    if (!file.startsWith("http")) file_url = `examples/${file}`;

    fetch(file_url).then(async (res) => {
      const text = await res.text();

      const currentProg = cm.state.doc.toString();

      cm.dispatch({
        changes: { from: 0, to: currentProg.length, insert: text }
      });
    });
  }
}