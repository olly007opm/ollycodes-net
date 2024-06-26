<script lang="ts">
    import { format } from "date-fns"
    import { onMount } from "svelte"

    let time = new Date()
    onMount(() => {
        const interval = setInterval(() => time = new Date(), 1000)
        return () => clearInterval(interval)
    })
</script>

<div id="task-bar">
    <div>
        <button class="btn btn-start">Start</button>
        <div class="separator"></div>
    </div>

    <div>
        <div class="separator"></div>
        <div class="time-box">
            <span>{format(time, "hh:mm:ss a")}</span>
        </div>
    </div>
</div>