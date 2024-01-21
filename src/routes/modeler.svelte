<script lang="ts">
  import { onMount } from "svelte";
  import Modeler from "bpmn-js/lib/Modeler";
  import PropertiesView from "./properties-panel/properties-view.svelte";

  import "bpmn-js/dist/assets/diagram-js.css";
  import "bpmn-js/dist/assets/bpmn-js.css";
  import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

  let containerRef: any;
  let modeler: any = undefined;

  export let diagramXml: string;

  onMount(() => {
    modeler = new Modeler({
      container: containerRef,
      additionalModules: [],
      moddleExtensions: {},
      keyboard: { bindTo: document.body },
    });
  });

  $: if (modeler && diagramXml) {
    modeler.importXML(diagramXml).then(({ warnings }: { warnings: any }) => {
      if (warnings.length) {
        console.warn(warnings);
      }

      modeler.get("canvas").zoom("fit-viewport");
    });
  }

  function handleExport() {}
</script>

<div class="modeler-parent">
  <div id="modeler-container" bind:this={containerRef}></div>
  <div id="properties-container">
    <button on:click={handleExport}>Export BPMN</button>
    {#if modeler}
      <PropertiesView {modeler} />
    {/if}
  </div>
</div>
