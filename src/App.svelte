<script>
import {Render } from "./lib"
import { onMount } from 'svelte';
let textureCanvas, referenceCanvas, fileInput;

let width =  $state(1000), 
    height = $state(1000), 
    padding = $state(10), 
    size = $state(64);

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
<input type="text" bind:value={width}>
<input type="text" bind:value={height}>
<input type="text" bind:value={padding}>
<input type="text" bind:value={size}>
<div id="links"></div>
<input bind:this={fileInput} type="file" id="fileInput" accept="image/*" multiple>
<div>
  <canvas bind:this={textureCanvas}></canvas>
  <canvas bind:this={referenceCanvas}></canvas>
</div>

</main>

<style>

</style>
