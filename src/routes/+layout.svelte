<script lang="ts">
    import "$css/main.css"
    import { inject } from '@vercel/analytics'
    import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit'
    inject()
    injectSpeedInsights()
</script>

<slot />