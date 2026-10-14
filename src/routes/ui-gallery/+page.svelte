<script lang="ts">
  import {
    Slider,
    ToggleSwitch,
    CheckBox,
    RadioGroup,
    ComboBox,
    ColorPicker,
    TextBox,
    NumberBox,
    Button,
    ControlGroup,
    Flyout,
    Expander
  } from '#lib/ui/index.ts';

  let expanderA = $state(true);
  let expanderB = $state(false);
  let expanderOpacity = $state(40);
  let expanderBlur = $state(8);
  let expanderSpacing = $state(12);
  let expanderRadius = $state(4);

  let sliderValue = $state(40);
  let flyoutOpen = $state(false);
  let sliderDisabled = $state(70);
  let toggleOn = $state(true);
  let toggleOff = $state(false);
  let check = $state(true);
  let checkDisabled = $state(false);
  let radio = $state('b');
  let radioH = $state('left');
  let radioDisabled = $state('one');
  let combo = $state('dark');
  let comboObj = $state('wide');
  let colorOpaque = $state('rgb(255, 255, 255)');
  let colorAlpha = $state('rgba(61, 90, 254, 0.5)');
  let colorHex = $state('#3d5afe');
  let text = $state('Hello');
  let textDisabled = $state('Locked');
  let num = $state(12);
  let numUnit = $state(1.5);
  let clicks = $state(0);

  const radioOptions = ['a', 'b', 'c'];
  const radioObjOptions = [
    { value: 'left', label: 'Left' },
    { value: 'center', label: 'Center' },
    { value: 'right', label: 'Right' }
  ];
  const comboOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Automatic' }
  ];
  const comboObjOptions = ['narrow', 'wide', 'full'];
</script>

<svelte:head>
  <title>UI gallery</title>
</svelte:head>

<main class="page">
  <h1>UI gallery</h1>

  <div class="groups">

  <ControlGroup title="Expander">
    <Expander title="Surface" bind:open={expanderA} summary="2 set">
      <Slider label="Opacity" bind:value={expanderOpacity} min={0} max={100} unit="%" />
      <Slider label="Blur" bind:value={expanderBlur} min={0} max={40} unit="px" />
    </Expander>
    <Expander title="Shape" bind:open={expanderB} summary="2 set">
      <Slider label="Corner radius" bind:value={expanderRadius} min={0} max={24} unit="px" />
      <Slider label="Spacing" bind:value={expanderSpacing} min={0} max={48} unit="px" />
    </Expander>
    <p class="bound">open: {expanderA} / {expanderB}</p>
  </ControlGroup>

  <ControlGroup title="Slider">
    <Slider label="Opacity" bind:value={sliderValue} min={0} max={100} unit="%" />
    <Slider label="Disabled" bind:value={sliderDisabled} disabled />
    <p class="bound">bound: {sliderValue} / {sliderDisabled}</p>
  </ControlGroup>

  <ControlGroup title="ToggleSwitch">
    <ToggleSwitch label="Shadows" bind:checked={toggleOn} />
    <ToggleSwitch label="Off state" bind:checked={toggleOff} onText="Yes" offText="No" />
    <ToggleSwitch label="Disabled" checked={true} disabled />
    <p class="bound">bound: {toggleOn} / {toggleOff}</p>
  </ControlGroup>

  <ControlGroup title="CheckBox">
    <CheckBox label="Enable animations" bind:checked={check} />
    <CheckBox label="Disabled (unchecked)" bind:checked={checkDisabled} disabled />
    <CheckBox label="Disabled (checked)" checked={true} disabled />
    <p class="bound">bound: {check} / {checkDisabled}</p>
  </ControlGroup>

  <ControlGroup title="RadioGroup">
    <RadioGroup label="Letter (string options)" options={radioOptions} bind:value={radio} />
    <RadioGroup label="Alignment (horizontal)" options={radioObjOptions} bind:value={radioH} horizontal />
    <RadioGroup label="Disabled" options={radioOptions} bind:value={radioDisabled} disabled />
    <p class="bound">bound: {radio} / {radioH} / {radioDisabled}</p>
  </ControlGroup>

  <ControlGroup title="ComboBox">
    <ComboBox label="Theme" options={comboOptions} bind:value={combo} />
    <ComboBox label="Width (string options)" options={comboObjOptions} bind:value={comboObj} />
    <ComboBox label="Disabled" options={comboOptions} value="light" disabled />
    <p class="bound">bound: {combo} / {comboObj}</p>
  </ControlGroup>

  <ControlGroup title="ColorPicker">
    <ColorPicker label="Opaque (rgb)" bind:value={colorOpaque} />
    <ColorPicker label="With alpha (rgba)" bind:value={colorAlpha} alpha />
    <ColorPicker label="Hex input" bind:value={colorHex} />
    <ColorPicker label="Disabled" value="#333" disabled />
    <p class="bound">bound: {colorOpaque} / {colorAlpha} / {colorHex}</p>
  </ControlGroup>

  <ControlGroup title="TextBox">
    <TextBox label="Name" bind:value={text} placeholder="Type something" />
    <TextBox label="Disabled" bind:value={textDisabled} disabled />
    <p class="bound">bound: {text} / {textDisabled}</p>
  </ControlGroup>

  <ControlGroup title="NumberBox">
    <NumberBox label="Count" bind:value={num} min={0} max={100} step={1} />
    <NumberBox label="Duration" bind:value={numUnit} min={0} step={0.5} unit="s" />
    <NumberBox label="Disabled" value={5} disabled unit="px" />
    <p class="bound">bound: {num} / {numUnit}</p>
  </ControlGroup>

  <ControlGroup title="Button">
    <div class="row">
      <Button onclick={() => clicks++}>Standard</Button>
      <Button variant="accent" onclick={() => clicks++}>Accent</Button>
      <Button disabled>Disabled</Button>
      <Button variant="accent" disabled>Accent disabled</Button>
    </div>
    <p class="bound">clicks: {clicks}</p>
  </ControlGroup>

  <ControlGroup title="Flyout">
    <div class="row">
      <Button onclick={() => (flyoutOpen = true)}>Open settings flyout</Button>
    </div>
    <p class="bound">open: {flyoutOpen}</p>
    <Flyout bind:open={flyoutOpen} title="Settings">
      <p>
        The flyout slides in from the right edge, covers the full height and closes on Esc,
        on the back arrow or on a click outside the panel.
      </p>
      <pre><code>&lt;Flyout bind:open title="Settings"&gt;
  &lt;p&gt;Content&lt;/p&gt;
&lt;/Flyout&gt;</code></pre>
    </Flyout>
  </ControlGroup>
  </div>
</main>

<style>
  .page {
    box-sizing: border-box;
    min-height: 100vh;
    padding: 24px;
    background: #fff;
    color: #000;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }

  h1 {
    margin: 0 0 32px;
    font-size: 24px;
    font-weight: 600;
  }

  .groups {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  pre {
    margin: 16px 0 0;
    padding: 12px;
    background: rgba(0, 0, 0, 0.06);
    font-family: Consolas, 'Courier New', monospace;
    font-size: 12px;
    overflow-x: auto;
  }

  .bound {
    margin: 0;
    font-family: Consolas, 'Courier New', monospace;
    font-size: 12px;
    color: #555;
  }
</style>
