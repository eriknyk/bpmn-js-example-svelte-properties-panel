<script lang="ts">
  import { onMount } from "svelte";
  import ElementProperties from "./element-properties.svelte";

  let selectedElements = [];
  let element: any | null = null;

  export let modeler: any;

  onMount(() => {
    modeler.on("selection.changed", (e: any) => {
      selectedElements = e.newSelection;
      element = e.newSelection[0];
    });

    modeler.on("element.changed", (e: any) => {
      if (!element) {
        return;
      }

      // update panel, if currently selected element changed
      if (e.element.id === element.id) {
        element = e.element;
      }
    });
  });
</script>

<div>
  {#if selectedElements.length === 1}
    <ElementProperties {modeler} {element} />
  {/if}

  {#if selectedElements.length === 0}
    <span>Please select an element.</span>
  {/if}

  {#if selectedElements.length > 1}
    <span>Please select a single element.</span>
  {/if}
</div>
