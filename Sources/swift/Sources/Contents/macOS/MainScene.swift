import Combine
import Schwifty
import SwiftUI

struct MainScene: Scene {
    @Inject private var appConfig: AppConfig

    var body: some Scene {
        WindowGroup {
            MacContentView()
                .launchSilently(appConfig.launchSilently)
        }
    }

    static func show() {
        if let window = AppWindowManager.shared.current {
            window.makeKeyAndOrderFront(nil)
            window.orderFrontRegardless()
            NSApp.activate(ignoringOtherApps: true)
        } else {
            showMainWindow()
        }
    }

    private static func showMainWindow() {
        let window = AppWindowManager.shared.build()
        AppWindowManager.shared.current = window
        window.show()
        window.orderFront(nil)
        window.makeKeyAndOrderFront(nil)
        window.becomeMain()
    }
}

private extension View {
    func launchSilently(_ silent: Bool) -> some View {
        modifier(LaunchSilentlyMod(silent: silent))
    }
}

private struct LaunchSilentlyMod: ViewModifier {
    let silent: Bool

    func body(content: Content) -> some View {
        if silent {
            content.opacity(0).onWindow { $0.close() }
        } else {
            content
        }
    }
}
