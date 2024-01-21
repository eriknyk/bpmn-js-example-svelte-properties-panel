<script lang="ts">
  import { browser } from "$app/environment";
  //@ts-ignore
  import diagramXml from "./diagram.bpmn";
  import "./styles.css";

  const modelerPromise = browser
    ? import("./modeler.svelte").then((module) => module.default)
    : new Promise<ConstructorOfATypedSvelteComponent>(() => {});
</script>

<!-- We need import dynamically the modeler component to avoid the SSR error -->
<!-- modeler can only be rendered on client side -->
{#await modelerPromise then component}
  <svelte:component this={component} {diagramXml} />
{/await}
