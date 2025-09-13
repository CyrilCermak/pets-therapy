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
    
    // UserDefaults key for tracking if user has made a consent choice
    private static let consentChoiceMadeKey = "AnalyticsConsentChoiceMade"
    
    @Published var shouldShowConsent: Bool = false
    
    init() {
        checkShouldShowConsent()
    }
    
    /// Check if we should show the consent dialog based on whether user has made a choice
    private func checkShouldShowConsent() {
        let hasUserMadeChoice = UserDefaults.standard.bool(forKey: Self.consentChoiceMadeKey)
        shouldShowConsent = !hasUserMadeChoice
    }
    
    /// User explicitly accepts analytics collection
    /// This enables analytics and logs the consent acceptance event
    func acceptAnalytics() {
        analyticsService.setAnalyticsEnabled(true)
        markConsentChoiceMade()
        
        // Log consent acceptance (this will now work since analytics is enabled)
        analyticsService.log(event: AppAnalyticsEvent.analyticsConsent(accepted: true))
    }
    
    /// User explicitly declines analytics collection
    /// This disables analytics (no decline event is logged since analytics is disabled)
    func declineAnalytics() {
        analyticsService.setAnalyticsEnabled(false)
        markConsentChoiceMade()
        
        // We don't log the decline since analytics is disabled
    }
    
    /// Mark that the user has made a consent choice and hide the dialog
    private func markConsentChoiceMade() {
        UserDefaults.standard.set(true, forKey: Self.consentChoiceMadeKey)
        shouldShowConsent = false
    }
    
    /// Reset consent choice and analytics state (for testing or complete privacy reset)
    /// This will cause the consent dialog to appear again on next app launch
    func resetConsentChoice() {
        UserDefaults.standard.removeObject(forKey: Self.consentChoiceMadeKey)
        UserDefaults.standard.removeObject(forKey: "AnalyticsEnabled")
        shouldShowConsent = true
    }
    
    /// Force show consent dialog immediately (for testing purposes)
    func forceShowConsent() {
        shouldShowConsent = true
    }
    
    /// Check if user has previously made a consent choice
    /// Returns true if user has either accepted or declined analytics
    var hasUserMadeChoice: Bool {
        return UserDefaults.standard.bool(forKey: Self.consentChoiceMadeKey)
    }
}