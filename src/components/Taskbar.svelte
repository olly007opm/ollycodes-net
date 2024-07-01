<script lang="ts">
    import { page } from "$app/stores"
    import { format } from "date-fns"
    import { onMount } from "svelte"
    import { createFloatingActions } from "svelte-floating-ui"
    import { signOut } from "@auth/sveltekit/client"
    import { focusWindow, windows } from "$stores/windows"
    import { createSignInWindow } from "$stores/windows/signin"
    import { createExplorerWindow } from "$stores/windows/explorer"
    import type { User } from "@prisma/client"

    let startMenuOpen = false
    let time = new Date()
    let startMenu: HTMLElement
    onMount(() => {
        const interval = setInterval(() => time = new Date(), 1000)
        const handleClick = (event: MouseEvent) => {
            if (startMenu && !startMenu.contains(event.target as Node) && !event.defaultPrevented) {
                startMenuOpen = false
            }
        }
        document.addEventListener("click", handleClick, true)
        return () => {
            clearInterval(interval)
            document.removeEventListener("click", handleClick, true)
        }
    })

    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "top-start"
    })

    $: wins = $windows.filter(w => w.taskbarIndex !== -1).sort((a, b) => a.taskbarIndex - b.taskbarIndex)
    $: username = ($page.data.session?.user as User).username
</script>

<div id="task-bar" on:dragover|preventDefault role="menu" tabindex="0">
    <div>
        <button class="btn btn-start" use:floatingRef on:click={() => startMenuOpen = !startMenuOpen}>
            <img src="/icon/windows-0.png" alt="start">
            <span>Start</span>
        </button>
        <div class="separator"></div>
        <div class="task-bar-items" style="grid-template-columns: repeat({Math.max($windows.length, 8)}, 1fr)">
            {#each wins as win}
                <button class="btn btn-taskbar no-focus-outline"
                    class:focused={win.focused} on:click={() => focusWindow(win)}
                >
                    <img src={win.icon} alt={win.id}>
                    <span>{win.title}</span>
                </button>
            {/each}
        </div>
    </div>

    <div>
        <div class="separator"></div>
        <div class="time-box">
            <img src="/icon/calendar-5.png" alt="calendar">
            <img src="/icon/loudspeaker_rays-1.png" alt="speaker">
            <span>{format(time, "hh:mm a")}</span>
        </div>
    </div>
</div>

{#if startMenuOpen}
    <div id="start-menu" use:floatingContent bind:this={startMenu}>
        <div class="start-menu-banner">
            <span>Olly</span>
        </div>

        <div class="start-menu-items">
            <button on:click={() => startMenuOpen = false}>
                <img src="/icon/directory_program_group-2.png" alt="programs">
                <span>Programs</span>
            </button>
            <button on:click={() => { createExplorerWindow("documents"); startMenuOpen = false }}>
                <img src="/icon/directory_open_file_mydocs-1.png" alt="documents">
                <span>Documents</span>
            </button>
            <button on:click={() => startMenuOpen = false}>
                <img src="/icon/settings_gear-0.png" alt="settings">
                <span>Settings</span>
            </button>
            <div class="separator"></div>
            {#if $page.data.session?.user}
                <button on:click={() => { signOut(); startMenuOpen = false }}>
                    <img src="/icon/key_win-3.png" alt="log off">
                    <span>Log Off{username ? " " + username : ""}...</span>
                </button>
            {:else}
                <button on:click={() => { createSignInWindow(); startMenuOpen = false }}>
                    <img src="/icon/key_win-3.png" alt="log in">
                    <span>Sign In...</span>
                </button>
            {/if}
        </div>
    </div>
{/if}