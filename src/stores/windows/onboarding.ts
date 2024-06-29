import { windows, type Window } from "$stores/windows"
import OnboardingWindow from "$components/windows/OnboardingWindow.svelte"

export function createOnboardingWindow() {
    const onboardingWindow: Window = {
        id: "onboarding",
        title: "Create User",
        icon: "/icon/user_computer-1.png",
        component: OnboardingWindow,
        x: 0,
        y: 0,
        width: 768,
        height: 512,
        minWidth: 512,
        minHeight: 256,
        resizable: false,
        closable: false,
        minimizable: false,
        movable: false,
        forceFocus: true,
        center: true,
        minimized: false,
        maximized: false,
        focused: true,
        taskbarIndex: 0
    }

    windows.update(wins => {
        wins.push(onboardingWindow)
        return wins
    })
}