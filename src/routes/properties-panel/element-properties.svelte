<script lang="ts">
  import { is } from "bpmn-js/lib/util/ModelUtil";

  export let modeler;
  export let element;

  if (element.labelTarget) {
    element = element.labelTarget;
  }

  function updateName(name) {
    const modeling = modeler.get("modeling");

    modeling.updateLabel(element, name);
  }

  function updateTopic(topic) {
    const modeling = modeler.get("modeling");

    modeling.updateProperties(element, {
      "custom:topic": topic,
    });
  }

  function makeMessageEvent() {
    const bpmnReplace = modeler.get("bpmnReplace");

    bpmnReplace.replaceElement(element, {
      type: element.businessObject.$type,
      eventDefinitionType: "bpmn:MessageEventDefinition",
    });
  }

  function makeServiceTask(name) {
    const bpmnReplace = modeler.get("bpmnReplace");

    bpmnReplace.replaceElement(element, {
      type: "bpmn:ServiceTask",
    });
  }

  function attachTimeout() {
    const modeling = modeler.get("modeling");
    const autoPlace = modeler.get("autoPlace");
    const selection = modeler.get("selection");

    const attrs = {
      type: "bpmn:BoundaryEvent",
      eventDefinitionType: "bpmn:TimerEventDefinition",
    };

    const position = {
      x: element.x + element.width,
      y: element.y + element.height,
    };

    const boundaryEvent = modeling.createShape(attrs, position, element, {
      attach: true,
    });

    const taskShape = append(boundaryEvent, {
      type: "bpmn:Task",
    });

    selection.select(taskShape);
  }

  function isTimeoutConfigured(element) {
    const attachers = element.attachers || [];

    return attachers.some((e) => hasDefinition(e, "bpmn:TimerEventDefinition"));
  }

  function append(element, attrs) {
    const autoPlace = modeler.get("autoPlace");
    const elementFactory = modeler.get("elementFactory");

    var shape = elementFactory.createShape(attrs);

    return autoPlace.append(element, shape);
  }

  function hasDefinition(event, definitionType) {
    const definitions = event.businessObject.eventDefinitions || [];

    return definitions.some((d) => is(d, definitionType));
  }
</script>

<div class="element-properties" key={element.id}>
  <fieldset>
    <label>id</label>
    <span>{element.id}</span>
  </fieldset>

  <fieldset>
    <label>name</label>
    <input
      value={element.businessObject.name || ""}
      on:change={(event) => {
        updateName(event.target.value);
      }}
    />
  </fieldset>

  {#if is(element, "custom:TopicHolder")}
    <fieldset>
      <label>topic (custom)</label>
      <input
        value={element.businessObject.get("custom:topic") || ""}
        on:change={(event) => {
          updateTopic(event.target.value);
        }}
      />
    </fieldset>
  {/if}

  <fieldset>
    <label>actions</label>

    {#if is(element, "bpmn:Task") && !is(element, "bpmn:ServiceTask")}
      <button on:click={makeServiceTask}>Make Service Task</button>
    {/if}

    {#if is(element, "bpmn:Event") && !hasDefinition(element, "bpmn:MessageEventDefinition")}
      <button on:click={makeMessageEvent}>Make Message Event</button>
    {/if}

    {#if is(element, "bpmn:Task") && !isTimeoutConfigured(element)}
      <button on:click={attachTimeout}>Attach Timeout</button>
    {/if}
  </fieldset>
</div>

<style>
  .element-properties label {
    font-weight: bold;
  }

  .element-properties label:after {
    content: ": ";
  }

  .element-properties button + button {
    margin-left: 10px;
  }
</style>
