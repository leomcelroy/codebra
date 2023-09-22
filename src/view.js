import { html, svg } from "lit-html";
import "./components/cm-editor.js";


export const view = (state) => {

  return html`
  	<div class="container">

        <div class="toolbar">
            <div class="menu-item upload-trigger">upload (shift+enter)</div>
            <div class="menu-separator">o</div>
            <div class="menu-item connect-trigger">connect${state.port === null ? "" : "-ed"}</div>
            <div class="menu-separator">o</div>
            <div class="menu-item download-trigger">download</div>
        </div>

        <div class="bottom">
          <div class="left-side">
            <div class="editor-container">
              <cm-editor></cm-editor>
            </div>
            <div class="log hidden"></div>
          </div>

          <div class="right-side">
            <div class="log-output">
              ${state.logs.map(x => html`<pre class="repl-log">${">>>  " + x}</pre>`)}
            </div>
            <div class="repl">
              <input class="repl-input"/>
            </div>
          </div>

          <div class="separator"></div>
        </div>

        <div class="drop-modal hidden"></div>

    </div>
  `
}