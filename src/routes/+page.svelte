<script lang="ts">
  import { browser } from "$app/environment";
  //@ts-ignore
  import diagramXml from "./diagram.bpmn";

  const ModelerConstructor = browser
    ? import("./modeler.svelte").then((module) => module.default)
    : new Promise<ConstructorOfATypedSvelteComponent>(() => {});

  import "./styles.css";
</script>

{#await ModelerConstructor}
  <p>Loading...</p>
{:then component}
  <svelte:component this={component} {diagramXml} />
{:catch error}
  <span>Something went wrong: {error.message}</span>
{/await}
