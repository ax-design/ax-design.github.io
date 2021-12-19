import { register } from '@ax-design/reveal-highlight';

let registered = false;

export const registerRevealHighlight = () => {
  if (!registered) {
    register({
      compat: true,
      borderDetectionMode: 'experimentalAutoFit',
    });

    registered = true;
  }

}