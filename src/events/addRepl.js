

export function addRepl(state) {

  document.body.addEventListener('keydown', async (event) => {

    const focusedEl = document.activeElement;

    if (!focusedEl.matches(".repl-input")) return;

    const { port } = state;

    if (event.key === 'Enter') {
      const val = focusedEl.value;

      const encoder = new TextEncoder();
      const data = encoder.encode(val + '\r\n');

      await port.write(data);
      focusedEl.value = '';

      console.log(state);
    }

    
  });
}