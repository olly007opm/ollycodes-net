<script lang="ts">
    import { offset, flip, shift } from "svelte-floating-ui/dom"
    import { createFloatingActions } from "svelte-floating-ui"

    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "bottom-start",
        middleware: [offset(-4), flip(), shift()]
    })

    export let placeholder: string
    export let value: string
    export let options: SelectOption[]
    type SelectOption = { value: string, label: string }
    let dropdown = false
    $: label = options.find(o => o.value === value)?.label ?? placeholder
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="select" use:floatingRef on:mouseleave={() => dropdown = false}>
    <button class:active={dropdown} on:click={() => dropdown = !dropdown}>
        <span>{label}</span>
        <button class="btn">
            <img src="/custom-icon/dropdown.png" alt="dropdown">
        </button>
    </button>
    {#if dropdown}
        <div class="select-content" use:floatingContent on:click={() => dropdown = false}>
            {#each options as option}
                <button on:click={() => value = option.value}>{option.label}</button>
            {/each}
        </div>
    {/if}
</div>
