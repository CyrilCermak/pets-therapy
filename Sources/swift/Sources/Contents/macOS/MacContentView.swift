import Schwifty
import SwiftUI
import Swinject

struct MacContentView: View {
    static let minSize = CGSize(width: 850, height: 760)

    var body: some View {
        ContentView()
            .frame(minWidth: MacContentView.minSize.width)
            .frame(minHeight: MacContentView.minSize.height)
            .analyticsConsentHandler()
            .onWindow { window in
                AppWindowManager.shared.current = window
                AppWindowManager.shared.customize(window)
            }
            .onDisappear {
                Logger.log("MacContentView", "Did disappear")
                AppWindowManager.shared.current = nil
            }
            .environmentObject(appConfig())
    }

    private func appConfig() -> AppConfig {
        Container.main.resolve(AppConfig.self)!
    }
}
