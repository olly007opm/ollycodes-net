<script lang="ts">
    import WindowBase from "$components/WindowBase.svelte"
    import type { Window } from "$stores/windows"

    export let win: Window
</script>

<WindowBase bind:win>
    Test Window Content
</WindowBase>