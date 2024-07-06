<script lang="ts">
    import { offset, flip, shift } from "svelte-floating-ui/dom"
    import { createFloatingActions } from "svelte-floating-ui"

    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "bottom-start",
        middleware: [offset(-4), flip(), shift()]
    })

    export let label: string
    let dropdown = false
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div
    class="toolbar-dropdown" use:floatingRef
    on:mouseenter={() => dropdown = true} on:mouseleave={() => dropdown = false}
>
    <button class="btn btn-ghost" class:active={dropdown}>{label}</button>
    {#if dropdown}
        <div class="toolbar-dropdown-content" use:floatingContent on:click={() => dropdown = false}>
            <slot />
        </div>
    {/if}
</div>
