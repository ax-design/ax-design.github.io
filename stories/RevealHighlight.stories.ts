import { BasicTemplate, PressureTestTemplate } from "./templates/RevealHighlight";

export default {
  title: "Components/Fundamental Elements/Reveal Highlight",
};

export const Basic = BasicTemplate.bind({});
Basic.argTypes =  {
  color: {
    control: "color",
    name: "Main Color",
    description: "Control color of all elements at the same time",
    table: {
      type: { summary: "<color>" },
      defaultValue: {
        summary: "rgba(0, 0, 0)",
      },
    },
  },
  opacity: {
    control: { type: "range", min: 0, max: 1, step: 0.01 },
    description: "Control opacity of all elements at the same time",
    table: {
      type: { summary: "<number>" },
      defaultValue: {
        summary: "0.26",
      },
    },
  },
  borderColor: {
    control: "color",
    description: "Color of the reveal border",
    table: {
      type: { summary: "<color>" },
      defaultValue: {
        summary: "rgba(0, 0, 0)",
      },
    },
  },
  borderWidth: {
    control: { type: "range", min: 0, max: 5, step: 1 },
    description: "Width of the reveal border",
    table: {
      type: { summary: "<length>" },
      defaultValue: {
        summary: "1",
      },
    },
  },
  borderFillRadius: { control: { type: "range", min: 0, max: 2, step: 0.01 }, },
  borderDecorationType: {
    control: { type: "select" },
    options: ["miter", "round", "bevel"],
  },
  borderDecorationTopLeftRadius: { control: "number" },
  borderDecorationTopRightRadius: { control: "number" },
  borderDecorationBottomLeftRadius: { control: "number" },
  borderDecorationBottomRightRadius: { control: "number" },
  borderTop: { type: "boolean" },
  borderRight: { type: "boolean" },
  borderBottom: { type: "boolean" },
  borderLeft: { type: "boolean" },
  hoverLight: { type: "boolean" },
  hoverLightColor: { control: "color" },
  hoverLightFillRadius: {
    control: { type: "range", min: 0, max: 3, step: 0.01 },
  },
  hoverLightFillRadiusMode: {
    control: { type: "select" },
    options: ["relative", "absolute"],
  },
  diffuse: { type: "boolean" },
  pressAnimation: { type: "boolean" },
  pressAnimationRadiusMode: {
    control: { type: "select" },
    options: ["constrained", "cover"],
  },
  pressAnimationColor: { control: "color" },
  pressAnimationSpeed: { type: "number" },
  releaseAnimationAccelerateRate: { type: "number" },
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
PressureTest.argTypes =  {
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