import { windows, Window } from "$stores/windows"
import Onboarding from "$components/windows/Onboarding.svelte"

export function createOnboardingWindow() {
    const onboardingWindow = new Window({
        id: "onboarding",
        title: "Create User",
        icon: "/icon/user_computer-1.png",
        component: Onboarding,
        width: 768,
        height: 512,
        minWidth: 768,
        minHeight: 512,
        resizable: false,
        closable: false,
        minimizable: false,
        movable: false,
        forceFocus: true,
        center: true,
        focused: true,
        taskbarIndex: 0
    })

    windows.update(wins => [...wins, onboardingWindow])
}