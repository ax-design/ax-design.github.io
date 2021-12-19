import { html } from 'lit-html';
import { styleMap } from 'lit-html/directives/style-map.js';

import { registerRevealHighlight } from './initialize';

registerRevealHighlight();

export const BasicTemplate = (x) => {
    const styles = {
        '--reveal-color': `${x.color}`,
        '--reveal-opacity': `${x.opacity}`,
        '--reveal-border-color': `${x.borderColor}`,
        '--reveal-border-width': `${x.borderWidth}px`,
        '--reveal-border-fill-radius': `${x.borderFillRadius}`,
        '--reveal-border-decoration-type': `${x.borderDecorationType || 'miter'}`,
        '--reveal-border-decoration-top-left-radius': `${x.borderDecorationTopLeftRadius}px`,
        '--reveal-border-decoration-top-right-radius': `${x.borderDecorationTopRightRadius}px`,
        '--reveal-border-decoration-bottom-left-radius': `${x.borderDecorationBottomLeftRadius}px`,
        '--reveal-border-decoration-bottom-right-radius': `${x.borderDecorationBottomRightRadius}px`,
        '--reveal-border-left-type': `${x.borderLeft ? 'line' : 'none'}`,
        '--reveal-border-right-type': `${x.borderRight ? 'line' : 'none'}`,
        '--reveal-border-top-type': `${x.borderTop ? 'line' : 'none'}`,
        '--reveal-border-bottom-type': `${x.borderBottom ? 'line' : 'none'}`,
        '--reveal-hover-light': `${x.hoverLight ? 'true' : 'false'}`,
        '--reveal-hover-light-color': `${x.hoverLightColor}`,
        '--reveal-hover-light-fill-radius': `${x.hoverLightFillRadius}`,
        '--reveal-hover-light-fill-radius-mode': `${x.hoverLightFillRadiusMode || 'relative'} `,
        '--reveal-diffuse': `${x.diffuse ? 'true' : 'false'}`,
        '--reveal-press-animation': `${x.pressAnimation ? 'true' : 'false'}`,
        '--reveal-press-animation-radius-mode': `${x.pressAnimationRadiusMode}`,
        '--reveal-press-animation-color': `${x.pressAnimationColor}`,
        '--reveal-press-animation-speed': `${x.pressAnimationSpeed}`,
        '--reveal-release-animation-accelerate-rate': `${x.releaseAnimationAccelerateRate}`,
    }
    return html`
        <ax-reveal-provider>
            <div id="container">
                <ax-reveal-bound>
                    <ax-reveal style=${styleMap(styles)}>❀</ax-reveal>
                </ax-reveal-bound>
            </div>
        </ax-reveal-provider>
        <style>
            #container {
                top: 50%;
                left: 50%;
                width: 300px;
                height: 100px;
                transform: translate(-50%, -50%);
                position: fixed;
            }

            #container ax-reveal {
                width: 100%;
                height: 100%;
                color: white;
                font-size: 20px;
                line-height: 100px;
                text-align: center;
            }
        </style>
    `;
};

const arr0 = (x: number): unknown[] => Array(x).fill(0);

export const PressureTestTemplate = (x) => {
    return html`
        <ax-reveal-provider>
            <div id="container">
                <ax-reveal-bound>
                    ${arr0(x.rows).map(() => html`
                        <div class="column">
                            ${arr0(x.columns).map(() => html`<ax-reveal>❀</ax-reveal>`)}
                        </div>
                    `)}
                </ax-reveal-bound>
            </div>
        </ax-reveal-provider>
        <style>
            #container {
                top: 50%;
                left: 50%;
                width: min-content;
                height: min-content;
                transform: translate(-50%, -50%);
                position: fixed;
            }

            #container .column {
                display: flex;
            }

            #container ax-reveal {
                width: 60px;
                height: 60px;
                margin: 2px;
                color: white;
                font-size: 24px;
                line-height: 60px;
                text-align: center;

                --reveal-color: #FFFFFF;
                --reveal-border-decoration-type: round;
                --reveal-border-decoration-top-left-radius: 2px;
                --reveal-border-decoration-top-right-radius: 4px;
                --reveal-border-decoration-bottom-left-radius: 6px;
                --reveal-border-decoration-bottom-right-radius: 8px;
            }
        </style>
    `;
};