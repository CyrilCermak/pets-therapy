//
// Pet Therapy.
//

import Schwifty
import SwiftUI

struct AnalyticsSettingsSwitch: View {
    @Inject private var analyticsService: AnalyticsService
    @StateObject private var consentViewModel = AnalyticsConsentViewModel()
    
    @State private var isAnalyticsEnabled: Bool = false
    @State private var showingDetails = false

    var body: some View {
        SettingsSwitch(
            label: Lang.Settings.anonymousTrackingTitle,
            value: $isAnalyticsEnabled,
            showHelp: $showingDetails
        )
        .onAppear {
            isAnalyticsEnabled = analyticsService.isAnalyticsEnabled
        }
        .onChange(of: isAnalyticsEnabled) { newValue in
            analyticsService.setAnalyticsEnabled(newValue)
            // Mark that user has made a choice
            UserDefaults.standard.set(true, forKey: "AnalyticsConsentChoiceMade")
            if newValue {
                analyticsService.log(event: AppAnalyticsEvent.analyticsConsent(accepted: true))
            }
        }
        .sheet(isPresented: $showingDetails) {
            VStack(alignment: .center, spacing: .xl) {
                Text(Lang.Settings.anonymousTrackingTitle)
                    .font(.largeTitle)
                    .padding(.top)
                Text(Lang.Settings.anonymousTrackingMessage)
                    .font(.body)
                    .multilineTextAlignment(.center)
                
                // Privacy Policy link
                Button(Lang.About.privacyPolicy) {
                    URL.visit(urlString: Lang.Urls.privacy)
                }
                .buttonStyle(.text)
                
                // Reset consent choice button for testing/debugging
                Button("Reset Analytics Consent") {
                    consentViewModel.resetConsentChoice()
                    isAnalyticsEnabled = false
                    showingDetails = false
                }
                .buttonStyle(.text)
                .foregroundColor(.red)
                
                Button(Lang.cancel) { showingDetails = false }
                    .buttonStyle(.text)
            }
            .padding()
            .frame(when: .is(.macOS), width: 450)
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
