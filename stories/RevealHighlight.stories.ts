import { BasicTemplate, PressureTestTemplate } from "./templates/RevealHighlight";

export default {
  title: "Components/Fundamental Elements/Reveal Highlight",
};

export const Basic = BasicTemplate.bind({});
Basic.argTypes = {
  color: {
    control: "color",
    name: "Main Color",
    description: "Control color of all elements at the same time, nothing happens by modifying this value, because he is overwritten by the following setting<br/>`--reveal-color`",
    table: {
      control: false,
      type: { summary: "<color>" },
      defaultValue: {
        summary: "rgba(0, 0, 0)",
      },
    },
  },
  opacity: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    name: "Opacity",
    description: "Control opacity of all elements at the same time<br/>`--reveal-opacity`",
    table: {
      type: { summary: "<number>" },
      defaultValue: {
        summary: "0.26",
      },
    },
  },
  borderColor: {
    control: "color",
    name: "Border Color",
    description: "Color of the reveal border<br/>`--reveal-border-color`",
    table: {
      type: { summary: "<color>" },
      defaultValue: {
        summary: "rgba(0, 0, 0)",
      },
    },
  },
  borderWidth: {
    control: { type: "range", min: 0, max: 5, step: 1 },
    name: "Border Width",
    description: "Width of the reveal border<br/>`--reveal-border-width`",
    table: {
      type: { summary: "<length>" },
      defaultValue: {
        summary: "1px",
      },
    },
  },
  borderFillRadius: {
    control: { type: "range", min: 0, max: 2, step: 0.01 },
    name: "Border Fill Radius",
    description: "Radius of the border gradient, please notice that this value is a number but not length<br/>`--reveal-border-fill-radius`",
    table: {
      type: { summary: "<number>" },
      defaultValue: {
        summary: "1.5",
      },
    },
  },
  borderDecorationType: {
    control: { type: "select" },
    options: ["miter", "round", "bevel"],
    name: "Border Decoration Type",
    description: "The shape of border radius, the same as possible values of lineJoin, checkout [this document](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/lineJoin)<br/>`--reveal-border-decoration-type`",
    table: {
      type: { summary: "'miter' | 'round' | 'bevel'" },
      defaultValue: {
        summary: "miter",
      },
    },
  },
  borderDecorationRadius: {
    control: "number",
    name: "Border Decoration Radius",
    description: "The radius of border radius, if --reveal-border-decoration-type is miter, nothing would happen<br/>`--reveal-border-decoration-radius`",
    table: {
      control: false,
      type: { summary: "<length>" },
      defaultValue: {
        summary: "0",
      },
    },
  },
  borderDecorationTopLeftRadius: {
    control: "number",
    name: "↖️ Decoration Radius",
    description: "Ditto<br/>`--reveal-border-decoration-top-left-radius`",
    table: {
      type: { summary: "<length>" },
      defaultValue: {
        summary: "0",
      },
    },
  },
  borderDecorationTopRightRadius: {
    control: "number",
    name: "↗️ Decoration Radius",
    description: "Ditto<br/>`--reveal-border-decoration-top-right-radius`",
    table: {
      type: { summary: "<length>" },
      defaultValue: {
        summary: "0",
      },
    },
  },
  borderDecorationBottomLeftRadius: {
    control: "number",
    name: "↙️ Decoration Radius",
    description: "Ditto<br/>`--reveal-border-decoration-bottom-left-radius`",
    table: {
      type: { summary: "<length>" },
      defaultValue: {
        summary: "0",
      },
    },
  },
  borderDecorationBottomRightRadius: {
    control: "number",
    name: "↘️ Decoration Radius",
    description: "Ditto<br/>`--reveal-border-decoration-bottom-right-radius`",
    table: {
      type: { summary: "<length>" },
      defaultValue: {
        summary: "0",
      },
    },
  },
  borderTop: {
    type: "boolean",
    name: "⬆️ Border Type",
    description: "Ditto<br/>`--reveal-border-top-type`",
    table: {
      type: { summary: "'line' | 'none'" },
      defaultValue: {
        summary: "line",
      },
    },
  },
  borderRight: {
    type: "boolean",
    name: "➡️ Border Type",
    description: "Ditto<br/>`--reveal-border-right-type`",
    table: {
      type: { summary: "'line' | 'none'" },
      defaultValue: {
        summary: "line",
      },
    },
  },
  borderBottom: {
    type: "boolean",
    name: "⬇️ Border Type",
    description: "Ditto<br/>`--reveal-border-bottom-type`",
    table: {
      type: { summary: "'line' | 'none'" },
      defaultValue: {
        summary: "line",
      },
    },
  },
  borderLeft: {
    type: "boolean",
    name: "⬅️ Border Type",
    description: "Show left border or not<br/>`--reveal-border-left-type`",
    table: {
      type: { summary: "'line' | 'none'" },
      defaultValue: {
        summary: "line",
      },
    },
  },
  hoverLight: {
    type: "boolean",
    name: "Hover Light",
    description: "Hover light is the light effect shown up when you hover on the reveal element, it will fill the whole element<br/>`--reveal-hover-light`",
    table: {
      type: { summary: "<boolean>" },
      defaultValue: {
        summary: "true",
      },
    },
  },
  hoverLightColor: {
    control: "color",
    name: "Hover Light Color",
    description: "The color of the hover light<br/>`--reveal-hover-light-color`",
    table: {
      type: { summary: "<color>" },
      defaultValue: {
        summary: "rgba(0, 0, 0)",
      },
    },
  },
  hoverLightFillRadius: {
    control: { type: "range", min: 0, max: 3, step: 0.01 },
    name: "Hover Light Fill Radius",
    description: "Radius of the highlight gradient, please notice that this value is a number but not length<br/>`--reveal-hover-light-fill-radius`",
    table: {
      type: { summary: "<number>" },
      defaultValue: {
        summary: "1.5",
      },
    },
  },
  hoverLightFillRadiusMode: {
    control: { type: "select" },
    options: ["relative", "absolute"],
    name: "Hover Light Fill Mode",
    description: `
How the program calculating the radius of gradient, if \`relative\` provided, gradient radius will be:

-   \`r(border) = min(width, height) * fillRadius\`
-   \`r(fill) = max(width, height) * fillRadius\`

If \`absolute\` provided, gradient will be:

-   \`r(border) = fillRadius\`
-   \`r(fill) = fillRadius\`

the unit is pixel.

\`--reveal-hover-light-fill-radius-mode\`
    `,
    table: {
      type: { summary: "'relative' | 'absolute'" },
      defaultValue: {
        summary: "relative",
      },
    },
  },
  diffuse: {
    type: "boolean",
    name: "Diffuse",
    description: "Control the behavior while pointer not in the reveal highlight element, if setted to `false`, nothing will be rendered; if setted to `true`, border will be rendered<br/>`--reveal-diffuse`",
    table: {
      type: { summary: "<boolean>" },
      defaultValue: {
        summary: "true",
      },
    },
  },
  pressAnimation: {
    type: "boolean",
    name: "Press Animation",
    description: "Enable the pressed animation or not<br/>`--reveal-press-animation`",
    table: {
      type: { summary: "<boolean>" },
      defaultValue: {
        summary: "true",
      },
    },
  },
  pressAnimationRadiusMode: {
    control: { type: "select" },
    options: ["constrained", "cover"],
    name: "Press Animation Radius Mode",
    description: "The filling mode of pressed animation, when using `cover`, the radius of pressed animation would be `max(width, height)`, when using `constrained`, it would be the radius of the hover light<br/>`--reveal-press-animation-fill-mode`",
    table: {
      type: { summary: "'cover' | 'constrained'" },
      defaultValue: {
        summary: "cover",
      },
    },
  },
  pressAnimationColor: {
    control: "color",
    name: "Press Animation Color",
    description: "The color of the hover light, could be rgb value or hex<br/>`--reveal-press-animation-color`",
    table: {
      type: { summary: "<color>" },
      defaultValue: {
        summary: "rgb(0, 0, 0)",
      },
    },
  },
  pressAnimationSpeed: {
    type: "number",
    name: "Press Animation Speed",
    description: "The duration of the animation being played when the mouse is held down by the element<br/>`--reveal-press-animation-speed`",
    table: {
      type: { summary: "<number>" },
      defaultValue: {
        summary: "2000",
      },
    },
  },
  releaseAnimationAccelerateRate: {
    type: "number",
    name: "Press Animation Speed",
    description: "The acceleration rate of the animation when the mouse is released<br/>`--reveal-release-animation-accelerate-rate`",
    table: {
      type: { summary: "<number>" },
      defaultValue: {
        summary: "6",
      },
    },
  },
};
Basic.args = {
  color: "#000000",
  opacity: 0.26,
  borderColor: "#000000",
  borderWidth: 1,
  borderFillRadius: 1.5,
  borderDecorationType: "miter",
  borderDecorationRadius: 0,
  borderDecorationTopLeftRadius: 0,
  borderDecorationTopRightRadius: 0,
  borderDecorationBottomLeftRadius: 0,
  borderDecorationBottomRightRadius: 0,
  borderLeft: "line",
  borderRight: "line",
  borderTop: "line",
  borderBottom: "line",
  hoverLight: true,
  hoverLightColor: "#000000",
  hoverLightFillRadius: 1.5,
  hoverLightFillRadiusMode: "relative",
  diffuse: true,
  pressAnimation: true,
  pressAnimationRadiusMode: "cover",
  pressAnimationColor: "#000000",
  pressAnimationSpeed: 2000,
  releaseAnimationAccelerateRate: 6,
};

export const PressureTest = PressureTestTemplate.bind({});
PressureTest.argTypes = {
  columns: {
    control: { type: "number", min: 0, max: 100, step: 1 },
  },
  rows: {
    control: { type: "number", min: 0, max: 100, step: 1 },
  }
}
PressureTest.args = {
  columns: 7,
  rows: 5,
}