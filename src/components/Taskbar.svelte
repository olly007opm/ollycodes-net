<script lang="ts">
    import { page } from "$app/stores"
    import { format } from "date-fns"
    import { onMount } from "svelte"
    import { createFloatingActions } from "svelte-floating-ui"
    import { signOut } from "@auth/sveltekit/client"
    import { windows } from "$stores/windows"
    import { createSignInWindow } from "$windows/signin"
    import type { User } from "@prisma/client"
    import StartSubmenu from "$components/StartSubmenu.svelte"
    import { createExplorerWindow } from "$windows/explorer"
    import { createNotepadWindow } from "$windows/notepad"

    let startMenuOpen = false
    let time = new Date()
    let startMenu: HTMLElement
    let startButton: HTMLElement
    onMount(() => {
        const interval = setInterval(() => time = new Date(), 1000)
        const handleClick = (event: MouseEvent) => {
            if (
                startMenu && startButton && !event.defaultPrevented
                && !(startMenu.contains(event.target as Node) || startButton.contains(event.target as Node))
            ) {
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
    $: user = $page.data.session?.user
    $: username = ($page.data.session?.user as User).username
</script>

<div id="task-bar" on:dragover|preventDefault role="menu" tabindex="0">
    <div>
        <button
            class="btn btn-start" use:floatingRef
            bind:this={startButton} on:click={() => startMenuOpen = !startMenuOpen}
        >
            <img src="/icon/windows-0.png" alt="start">
            <span>Start</span>
        </button>
        <div class="separator"></div>
        <div class="task-bar-items" style="grid-template-columns: repeat({Math.max($windows.length, 8)}, 1fr)">
            {#each wins as win}
                <button
                    class="btn btn-taskbar no-focus-outline"
                    class:focused={win.focused} on:click={() => win.focus()}
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
            <StartSubmenu>
                <svelte:fragment slot="button">
                    <img src="/icon/directory_program_group-2.png" alt="programs">
                    <span>Programs</span>
                </svelte:fragment>
                <button on:click={() => { createExplorerWindow("root"); startMenuOpen = false }}>
                    <img src="/icon/computer_explorer-2.png" alt="file explorer">
                    <span>File Explorer</span>
                </button>
                <button on:click={() => { createNotepadWindow(); startMenuOpen = false }}>
                    <img src="/icon/notepad-1.png" alt="notepad">
                    <span>Notepad</span>
                </button>
                <button on:click={() => startMenuOpen = false} disabled>
                    <img src="/icon/msie1-0.png" alt="internet explorer">
                    <span>Internet Explorer</span>
                </button>
                <button on:click={() => startMenuOpen = false} disabled>
                    <img src="/icon/network_cool_two_pcs-5.png" alt="internet messaging">
                    <span>Internet Messaging</span>
                </button>
            </StartSubmenu>
            <StartSubmenu>
                <svelte:fragment slot="button">
                    <img src="/icon/directory_open_file_mydocs-1.png" alt="documents">
                    <span>Documents</span>
                </svelte:fragment>
                <button on:click={() => { createExplorerWindow("root"); startMenuOpen = false }}>
                    <img src="/icon/computer_explorer-2.png" alt="my computer">
                    <span>My Computer</span>
                </button>
                <button on:click={() => { createExplorerWindow("documents"); startMenuOpen = false }} disabled={!user}>
                    <img src="/icon/directory_open_file_mydocs-1.png" alt="my documents">
                    <span>My Documents</span>
                </button>
                <button on:click={() => { createExplorerWindow("bin"); startMenuOpen = false }} disabled={!user}>
                    <img src="/icon/recycle_bin_empty-0.png" alt="recycle bin">
                    <span>Recycle Bin</span>
                </button>
            </StartSubmenu>
            <button on:click={() => startMenuOpen = false} disabled>
                <img src="/icon/settings_gear-0.png" alt="settings">
                <span>Settings</span>
            </button>
            <div class="separator"></div>
            {#if user}
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