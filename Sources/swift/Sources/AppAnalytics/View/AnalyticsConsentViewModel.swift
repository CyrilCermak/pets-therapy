//
// Pet Therapy.
//

import Foundation
import SwiftUI
import Schwifty

/// ViewModel responsible for managing user consent for analytics data collection.
/// 
/// This implementation follows GDPR best practices by:
/// - Using a privacy-first approach (analytics disabled by default)
/// - Requiring explicit user consent before enabling analytics
/// - Allowing users to change their choice at any time
/// - Storing consent choice separately from analytics state
///
/// The consent dialog will be shown on app startup if the user hasn't made a choice yet.
class AnalyticsConsentViewModel: ObservableObject {
    @Inject private var analyticsService: AnalyticsService
    
    @Published var shouldShowConsent: Bool = false
    
    init() {
        checkShouldShowConsent()
    }
    
    /// Check if we should show the consent dialog based on whether user has made a choice
    private func checkShouldShowConsent() {
        shouldShowConsent = !analyticsService.hasUserMadeConsentChoice
    }
    
    /// User explicitly accepts analytics collection
    /// This enables analytics and logs the consent acceptance event
    func acceptAnalytics() {
        analyticsService.setAnalyticsEnabled(true)
        shouldShowConsent = false
        
        // Log consent acceptance (this will now work since analytics is enabled)
        analyticsService.log(event: AppAnalyticsEvent.analyticsConsent(accepted: true))
    }
    
    /// User explicitly declines analytics collection
    /// This disables analytics (no decline event is logged since analytics is disabled)
    func declineAnalytics() {
        analyticsService.setAnalyticsEnabled(false)
        shouldShowConsent = false
        
        // We don't log the decline since analytics is disabled
    }
    
    /// Reset consent choice and analytics state (for testing or complete privacy reset)
    /// This will cause the consent dialog to appear again on next app launch
    func resetConsentChoice() {
        analyticsService.resetConsentChoice()
        shouldShowConsent = true
    }
    
    /// Force show consent dialog immediately (for testing purposes)
    func forceShowConsent() {
        shouldShowConsent = true
    }
    
    /// Check if user has previously made a consent choice
    /// Returns true if user has either accepted or declined analytics
    var hasUserMadeChoice: Bool {
        return analyticsService.hasUserMadeConsentChoice
    }
}