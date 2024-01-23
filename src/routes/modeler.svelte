<script lang="ts">
  import { onMount } from "svelte";
  import Modeler from "bpmn-js/lib/Modeler";
  import PropertiesView from "./properties-panel/properties-view.svelte";
  import customModdleExtension from "./moddle/custom.json";

  import "bpmn-js/dist/assets/diagram-js.css";
  import "bpmn-js/dist/assets/bpmn-js.css";
  import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

  let containerRef: any;
  let modeler: any = undefined;

  export let diagramXml: string;

  onMount(() => {
    modeler = new Modeler({
      container: containerRef,
      moddleExtensions: {
        custom: customModdleExtension,
      },
      keyboard: {
        bindTo: document.body,
      },
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

  function handleExport() {
    modeler.saveXML({ format: true }).then(({ xml, error }) => {
      if (error) {
        console.error(error);
        return;
      }

      console.log("UPDATE XML:", xml);
      fileSave(xml, "export.bpmn");
    });
  }

  function fileSave(sourceText, fileIdentity) {
    var workElement = document.createElement("a");

    if ("download" in workElement) {
      workElement.href = "data:text/xml;charset=utf-8," + escape(sourceText);
      workElement.setAttribute("download", fileIdentity);
      document.body.appendChild(workElement);
      var eventMouse = document.createEvent("MouseEvents");
      // prettier-ignore
      eventMouse.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      workElement.dispatchEvent(eventMouse);
      document.body.removeChild(workElement);
    } else {
      throw "File saving not supported for this browser";
    }
  }
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
