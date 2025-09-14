//
// Pet Therapy.
//

import SwiftUI
import Schwifty

struct AnalyticsConsentView: View {
    @ObservedObject var viewModel: AnalyticsConsentViewModel
    
    var body: some View {
        VStack(spacing: .xl) {
            // Title
            Text(Lang.Analytics.consentTitle)
                .font(.boldTitle)
                .multilineTextAlignment(.center)
            
            // Main message
            Text(Lang.Analytics.consentMessage)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
            
            Spacer()
            
            // Visual element (similar to onboarding)
            AnalyticsIcon()
            
            Spacer()
            
            // Privacy note with link
            VStack(spacing: .md) {
                Text(Lang.Analytics.privacyNote)
                    .font(.caption)
                    .multilineTextAlignment(.center)
                    .foregroundColor(.secondary)
                
                Button(Lang.About.privacyPolicy) {
                    URL.visit(urlString: Lang.Urls.privacy)
                }
                .buttonStyle(.text)
                .font(.caption)
            }
            .padding(.horizontal)
            
            // Action buttons
            VStack(spacing: .md) {
                Button(Lang.Analytics.consentAccept) {
                    withAnimation {
                        viewModel.acceptAnalytics()
                    }
                }
                .buttonStyle(.regular)
                
                Button(Lang.Analytics.consentDecline) {
                    withAnimation {
                        viewModel.declineAnalytics()
                    }
                }
                .buttonStyle(.text)
            }
        }
        .padding()
    }
}

private struct AnalyticsIcon: View {
    var body: some View {
        Image(systemName: "chart.bar.fill")
            .font(.system(size: 60))
            .foregroundColor(.accent)
            .frame(width: 150, height: 150)
    }
}

// MARK: - View Modifier

extension View {
    func analyticsConsentHandler() -> some View {
        modifier(AnalyticsConsentMod())
    }
}

private struct AnalyticsConsentMod: ViewModifier {
    @StateObject private var viewModel = AnalyticsConsentViewModel()
    
    func body(content: Content) -> some View {
        content
            .sheet(isPresented: $viewModel.shouldShowConsent) {
                AnalyticsConsentView(viewModel: viewModel)
                    .interactiveDismissDisabled() // Prevent dismissing without making a choice
            }
    }
}
