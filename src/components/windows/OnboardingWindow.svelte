<script lang="ts">
    import WindowBase from "$components/WindowBase.svelte"
    import type { Window } from "$stores/windows"

    export let win: Window

    let username: String
</script>

<WindowBase bind:win>
    <div class="wizard-window">
        <div class="wizard-banner bg-teal">
            <img src="/banner/onboarding.png" alt="key" class="w-[192px]">
        </div>
        <div class="wizard-content">
            <span class="mb-4">Create a new user</span>
            <span class="mb-8">Enter a username to get started</span>
            <form class="form-control">
                <label class="form-group">
                    <span>Username:</span>
                    <input type="text" bind:value={username}>
                </label>
            </form>
        </div>
        <div class="wizard-footer">
            <button class="btn" disabled>Next ></button>
        </div>
    </div>
</WindowBase>