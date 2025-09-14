//
// Pet Therapy.
//

import Schwifty
import SwiftUI

struct AnalyticsSettingsSwitch: View {
    @Inject private var analyticsService: AnalyticsService
    
    @State private var isAnalyticsEnabled: Bool = false

    var body: some View {
        SettingsSwitch(
            label: Lang.Analytics.settingsToggleLabel,
            value: $isAnalyticsEnabled
        )
        .onAppear {
            isAnalyticsEnabled = analyticsService.isAnalyticsEnabled
        }
        .onChange(of: isAnalyticsEnabled) { newValue in
            analyticsService.setAnalyticsEnabled(newValue)
        }
        .positioned(.leading)
    }
}

// MARK: - Reset Analytics Consent Button

struct ResetAnalyticsConsentButton: View {
    @StateObject private var consentViewModel = AnalyticsConsentViewModel()
    @Inject private var analyticsService: AnalyticsService
    
    var body: some View {
        Button("Reset Analytics Consent (Testing)") {
            consentViewModel.resetConsentChoice()
        }
        .buttonStyle(.text)
        .foregroundColor(.orange)
        .positioned(.leading)
    }
}
