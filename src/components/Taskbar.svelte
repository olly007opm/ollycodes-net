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
            <img src="/icon/calendar-5.png" alt="calendar">
            <img src="/icon/loudspeaker_rays-1.png" alt="calendar">
            <span>{format(time, "hh:mm a")}</span>
        </div>
    </div>
</div>