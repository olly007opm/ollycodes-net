/** @type {import('tailwindcss').Config} */
export default {
    content : ['./src/**/*.{html,js,svelte,ts}'],
    theme : {
        extend : {
            colors: {
                teal: "#008080",
                base: {
                    100: "var(--base-100)",
                    200: "var(--base-200)",
                    300: "var(--base-300)",
                    900: "var(--base-900)"
                },
                red: "var(--win-red)",
                blue: "var(--win-blue)",
                darkblue: "var(--win-dark-blue)"
            },
            spacing: {
                '0.5': '1px',
                '1': '2px',
                '1.5': '3px',
                '2': '4px',
                '2.5': '5px',
                '3': '6px',
                '3.5': '7px',
                '4': '8px',
                '5': '10px',
                '6': '12px',
                '7': '14px',
                '8': '16px',
                '9': '18px',
                '10': '20px',
                '11': '22px',
                '12': '24px',
                '14': '28px',
                '16': '32px',
                '18': '36px',
                '20': '40px',
                '24': '48px',
                '28': '56px',
                '32': '64px',
                '36': '72px',
                '40': '80px',
                '44': '88px',
                '48': '96px',
                '52': '104px',
                '56': '112px',
                '60': '120px',
                '64': '128px',
                '72': '144px',
                '80': '160px',
                '96': '192px'
            }
        },
        cursor: {
            "crosshair": "url(cursor/crosshair.cur), crosshair",
            "default": "url(cursor/default.cur), default",
            "ew-resize": "url(cursor/ew-resize.cur), ew-resize",
            "help": "url(cursor/help.cur), help",
            "move": "url(cursor/move.cur), move",
            "nesw-resize": "url(cursor/nesw-resize.cur), nesw-resize",
            "not-allowed": "url(cursor/not-allowed.cur), not-allowed",
            "ns-resize": "url(cursor/ns-resize.cur), ns-resize",
            "nwse-resize": "url(cursor/nwse-resize.cur), nwse-resize",
            "pointer": "url(cursor/pointer.cur), pointer",
            "progress": "url(cursor/progress.cur), progress",
            "text": "url(cursor/text.cur), text",
            "wait": "url(cursor/wait.cur), wait"
        }
    },
    plugins : [
        require('@tailwindcss/typography')
    ]
}

