// The welcome curtain of the site (see app.html) lifts over 400 ms once the packages are
// registered. A page whose tiles come in with an entrance waits for it to be mostly gone: under
// the curtain the entrance would play unseen.
export function curtainGone(): Promise<void> {
  return new Promise((resolve) => {
    const wait = () => {
      const curtain = document.getElementById('curtain');
      if (!curtain) resolve();
      else if (curtain.classList.contains('lifted')) setTimeout(resolve, 250);
      else setTimeout(wait, 50);
    };
    wait();
  });
}
