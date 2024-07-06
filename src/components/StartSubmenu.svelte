<script lang="ts">
    import { offset, flip, shift } from "svelte-floating-ui/dom"
    import { createFloatingActions } from "svelte-floating-ui"

    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "left-start",
        middleware: [offset(-8), flip(), shift()]
    })

    let submenuOpen = false
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div
    class="start-submenu" use:floatingRef
    on:mouseenter={() => submenuOpen = true} on:mouseleave={() => submenuOpen = false}
>
    <button class="start-submenu-button" class:active={submenuOpen}>
        <slot name="button" />
        <img src="/custom-icon/dropdown-side.png" class="dropdown-side" alt="dropdown">
    </button>
    {#if submenuOpen}
        <div class="start-submenu-content" use:floatingContent>
            <slot />
        </div>
    {/if}
</div>
