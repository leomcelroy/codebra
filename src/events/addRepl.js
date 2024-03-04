
export function addRepl(state) {

  document.body.addEventListener('keydown', async (event) => {

    const focusedEl = document.activeElement;

    if (!focusedEl.matches(".repl-input")) return;

    const { port, repl } = state;

    if (event.key === 'Enter') {
      const val = focusedEl.value;
      const result = await repl.write(val);
      
      console.log(result);

      // const outputDiv = document.querySelector(".log-output");
      // state.logs += log;
      // state.actions.render();
      // outputDiv.scrollTop = outputDiv.scrollHeight;

      focusedEl.value = '';
    }

    
  });
}