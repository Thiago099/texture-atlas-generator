<script>
import {Render } from "./lib"
import { onMount } from 'svelte';
let textureCanvas, referenceCanvas, fileInput;

let width =  $state(1000), 
    height = $state(1000), 
    padding = $state(10), 
    size = $state(64);

let view = "reference"

function Update(){
  Render(
    Number(width),
    Number(height),
    Number(padding),
    Number(size),
    textureCanvas,
    referenceCanvas,
    fileInput
  )
}
$effect(() => {
    Update();
});
onMount(() => {
  fileInput.addEventListener("input", Update)
});
</script>

<main>
  <div class="grid-container">
    <div class="sidebar">
      <h3>These are the parameters you can use to generate your atlas</h3>
      <label for="width-input">Width:</label>
      <input id="width-input" type="text" bind:value={width}>
      <label for="height-input">Height:</label>
      <input id="height-input" type="text" bind:value={height}>
      <label for="padding-input">Padding:</label>
      <input id="padding-input" type="text" bind:value={padding}>
      <label for="size-input">Size:</label>
      <input id="size-input"type="text" bind:value={size}>
      <label for="fileInput">Upload the files:</label>
      <input bind:this={fileInput} type="file" id="fileInput" accept="image/*" multiple name="heel">
    </div>
    <div class="content">
        <button onclick={()=>view="reference"}>View Reference</button>
        <button onclick={()=>view="final"}>View Final</button>
        <canvas style="display: {view == "reference"?"none":"block"};"  bind:this={textureCanvas}></canvas>
        <canvas style="display: {view == "final"?"none":"block"};"   bind:this={referenceCanvas}></canvas>
      <label for="fileInput">Download the assets:</label>
      <div id="links"></div>
    </div>
  </div>

</main>

<style>
.grid-container {
    display: grid;
    grid-template-areas:"sidebar content";
    grid-template-columns:500px 1fr;
    grid-template-rows: 90vh;
    gap: 10px;
}
.sidebar {
    grid-area: sidebar;
    display: flex;
    flex-direction: column;
}

label{
  margin-top: 10px;
}

.content {
    grid-area: content;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
canvas{
  border: 1px solid #ccc;
  height: 80%;
  margin: 5px;
}
</style>
