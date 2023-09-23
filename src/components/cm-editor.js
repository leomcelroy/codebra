import { EditorView, basicSetup } from "codemirror"
import { keymap } from "@codemirror/view";
import { python } from "@codemirror/lang-python"
import { EditorState, StateField } from "@codemirror/state";
import { syntaxTree, indentUnit } from "@codemirror/language";
import { indentWithTab } from "@codemirror/commands";

import { createComponent, html } from "../createComponent.js";

export function initCodeMirror(el) {

  const keybindings = keymap.of([indentWithTab]);
  const extensions = [
    python(),
    basicSetup, 
    keybindings,
    indentUnit.of("  "),
  ]

  // this doesn't get updated
  const state = EditorState.create({ extensions });

  const view = new EditorView({
    state,
    parent: el
  })

  return view;
}


createComponent({
  name: "cm-editor",
  view: el => html`
    <div class="editor"></div>
  `,
  css: `
    .editor {
      width: 100%;
      height: 100%;
    }

    .cm-editor {
      height: 100%;
    }

  `,
  onConnect: el => {
    const container = el.dom.querySelector(".editor");
    el.codemirror = initCodeMirror(container);
  }
})







