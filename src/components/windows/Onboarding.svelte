<script lang="ts">
    import { onMount } from "svelte"
    import WindowBase from "$components/WindowBase.svelte"
    import { checkUsername } from "$lib/username"
    import { closeWindow, type Window } from "$stores/windows"

    export let win: Window

    let username: string
    let usernameValid: boolean = false
    let errorMessage = ""
    let stage = 0

    onMount(() => win.ready = true)

    function checkNewUsername() {
        console.log(username)
        let { valid, message } = checkUsername(username)
        if (!valid) {
            usernameValid = false
            errorMessage = message || "Invalid username"
        } else {
            fetch("/api/username/check", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username })
            }).then(res => res.json()).then(data => {
                if (data.valid) {
                    usernameValid = true
                    errorMessage = ""
                } else {
                    usernameValid = false
                    errorMessage = data.message
                }
            })
        }
    }

    function setUsername() {
        if (!usernameValid) return
        fetch("/api/username/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username })
        }).then(res => res.json()).then(data => {
            if (data.success) {
                win.closable = true
                win.minimizable = true
                win.forceFocus = false
                stage = 1
            } else {
                usernameValid = false
                errorMessage = data.message
            }
        })
    }
</script>

<WindowBase bind:win>
    <div class="wizard-window">
        <div class="wizard-banner bg-teal">
            <img src="/banner/onboarding.png" alt="key" class="h-full p-16">
        </div>
        <div class="wizard-content">
            {#if stage === 0}
                <span class="mb-4">Create a new user</span>
                <span class="mb-4">Enter a username to get started</span>
                <span class="mb-8">Usernames must be unique, between 3 and 24 characters, and can only contain letters, numbers, and underscores.</span>
                <form class="form-control">
                    <label class="form-group">
                        <span>Username:</span>
                        <input type="text" bind:value={username} on:input={checkNewUsername}>
                        {#if username && !usernameValid}
                            <span class="form-error">{errorMessage}</span>
                        {/if}
                    </label>
                </form>
            {:else if stage === 1}
                <span class="mb-4">Welcome, {username}!</span>
                <span class="mb-4">Your account has been created successfully.</span>
                <span class="mb-4">You can change your username at any time in the settings menu.</span>
            {/if}
        </div>
        <div class="wizard-footer">
            {#if stage === 0}
                <button class="btn" disabled={!usernameValid} on:click={setUsername}>Next ></button>
            {:else if stage === 1}
                <button class="btn" on:click={() => closeWindow(win)}>Close</button>
            {/if}
        </div>
    </div>
</WindowBase>