<script lang="ts">
    import { offset, flip, shift } from "svelte-floating-ui/dom"
    import { createFloatingActions } from "svelte-floating-ui"

    export let label: string
    export let child: boolean = false
    let dropdown = false

    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: child ? "right-start" : "bottom-start",
        middleware: [offset(-4), flip(), shift()]
    })
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div
    class="toolbar-dropdown" use:floatingRef
    on:mouseenter={() => dropdown = true} on:mouseleave={() => dropdown = false}
>
    <button class:btn={!child} class:btn-ghost={!child} class:active={dropdown}>
        {label}
        {#if child}
            <img src="/custom-icon/dropdown-side.png" alt="dropdown" class="w-4">
        {/if}
    </button>
    {#if dropdown}
        <div class="toolbar-dropdown-content" use:floatingContent on:click={() => dropdown = false}>
            <slot />
        </div>
    {/if}
</div>
