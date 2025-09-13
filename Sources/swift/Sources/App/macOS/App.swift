import RateKit
import Schwifty
import SwiftUI

@main
struct MyApp: App {
    // swiftlint:disable:next weak_delegate
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    init() {
        Dependencies.setup()
        Logger.isEnabled = true
        Logger.log("MyApp", "Init")
    }

    var body: some Scene {
        MainScene()
    }
}

class AppDelegate: NSObject, NSApplicationDelegate {
    @Inject private var config: AppConfig
    @Inject private var commandLine: CommandLineUseCase
    @Inject private var notifications: NotificationsService
    @Inject private var onScreen: OnScreenCoordinator
    @Inject private var analytics: AnalyticsService

    func applicationDidFinishLaunching(_ notification: Notification) {
        Logger.log("AppDelegate", "Did finish launching")
        commandLine.handleCommandLineArgs()
        notifications.start()
        analytics.configure()
        analytics.log(event: AppAnalyticsEvent.appLaunch)

        if config.floatOverFullscreenApps {
            NSApp.setActivationPolicy(.accessory)
        } else {
            NSApp.setActivationPolicy(.regular)
        }
        startApp()
        scheduleAskForRatingIfNeeded()
    }

    func applicationDidChangeScreenParameters(_ notification: Notification) {
        Logger.log("App", "Screen params changed, relaunching...")
        onScreen.hide()
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) { [weak self] in
            self?.onScreen.show()
        }
    }

    private func startApp() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 1) { [weak self] in
            guard let self else { return }
            self.onScreen.show()
            if config.showInMenuBar {
                StatusBarCoordinator.shared.show()
            }
        }
    }

    private func scheduleAskForRatingIfNeeded() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
            RateKit.ratingsService(debug: true, launchesBeforeAskingForReview: 10)
                .askForRatingIfNeeded()
        }
    }
}
