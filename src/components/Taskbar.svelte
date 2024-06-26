<script lang="ts">
    import { page } from "$app/stores"
    import { format } from "date-fns"
    import { onMount } from "svelte"
    import { createFloatingActions } from "svelte-floating-ui"
    import { signIn, signOut } from "@auth/sveltekit/client"

    let startMenuOpen = true
    let time = new Date()
    onMount(() => {
        const interval = setInterval(() => time = new Date(), 1000)
        return () => clearInterval(interval)
    })

    const [floatingRef, floatingContent] = createFloatingActions({
        strategy: "absolute",
        placement: "top-start"
    })

</script>

<div id="task-bar">
    <div>
        <button class="btn btn-start" use:floatingRef on:click={() => startMenuOpen = !startMenuOpen}>Start</button>
        <div class="separator"></div>
    </div>

    <div>
        <div class="separator"></div>
        <div class="time-box">
            <img src="/icon/calendar-5.png" alt="calendar">
            <img src="/icon/loudspeaker_rays-1.png" alt="calendar">
            <span>{format(time, "hh:mm a")}</span>
        </div>
    </div>
</div>

{#if startMenuOpen}
    <div id="start-menu" use:floatingContent>
        <div class="start-menu-banner">
            <span>Olly</span>
        </div>

        <div class="start-menu-items">
            <button>
                <img src="/icon/directory_program_group-2.png" alt="settings">
                <span>Programs</span>
            </button>
            <button>
                <img src="/icon/directory_open_file_mydocs-1.png" alt="settings">
                <span>Documents</span>
            </button>
            <button>
                <img src="/icon/settings_gear-0.png" alt="settings">
                <span>Settings</span>
            </button>
            <div class="separator"></div>
            {#if $page.data.session?.user}
                <button on:click={() => signOut()}>
                    <img src="/icon/key_win-3.png" alt="settings">
                    <span>Log Off {$page.data.session.user.name}...</span>
                </button>
            {:else}
                <button on:click={() => signIn("github")}>
                    <img src="/icon/key_win-3.png" alt="settings">
                    <span>Log In...</span>
                </button>
            {/if}
        </div>
    </div>
{/if}