import Foundation
import Schwifty
import FirebaseAnalytics
import FirebaseCore

final class FirebaseAnalyticsService: AnalyticsService {
    // MARK: - Privacy Settings
    private struct PrivacySettings {
        /// Key for storing analytics enabled state in UserDefaults
        static let analyticsEnabledKey = "AnalyticsEnabled"
        
        /// Key for storing whether user has made a consent choice
        static let consentChoiceMadeKey = "AnalyticsConsentChoiceMade"
        
        /// Default analytics enabled state (should be false for privacy-first approach)
        static let defaultAnalyticsEnabled = false
    }
    
    private var firebaseConfigAvailable: Bool {
        Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist") != nil
    }
    
    private var isConfigured = false
    private var _isAnalyticsEnabled: Bool {
        get { UserDefaults.standard.bool(forKey: PrivacySettings.analyticsEnabledKey) }
        set { UserDefaults.standard.set(newValue, forKey: PrivacySettings.analyticsEnabledKey) }
    }
    
    var isAnalyticsEnabled: Bool {
        return _isAnalyticsEnabled
    }
    
    var hasUserMadeConsentChoice: Bool {
        return UserDefaults.standard.object(forKey: PrivacySettings.consentChoiceMadeKey) != nil
    }
    
    func configure() {
        guard !isConfigured else { return }
        
        guard firebaseConfigAvailable else {
            Logger.debug("AnalyticsService", "Firebase Info.plist not configured. Skipping Firebase init.")
            return
        }
        
        FirebaseApp.configure()
        isConfigured = true
        
        // Set initial analytics state from UserDefaults
        // If never set before, use privacy-first default (disabled)
        if UserDefaults.standard.object(forKey: PrivacySettings.analyticsEnabledKey) == nil {
            _isAnalyticsEnabled = PrivacySettings.defaultAnalyticsEnabled
        }
        
        // Apply the current analytics state to Firebase
        Analytics.setAnalyticsCollectionEnabled(_isAnalyticsEnabled)
    }
    
    func setAnalyticsEnabled(_ enabled: Bool) {
        _isAnalyticsEnabled = enabled
        // That user has made a choice when they enable/disable analytics, consent will no longer be shown
        UserDefaults.standard.set(true, forKey: PrivacySettings.consentChoiceMadeKey)
        Analytics.setAnalyticsCollectionEnabled(enabled)
    }
    
    func resetConsentChoice() {
        UserDefaults.standard.removeObject(forKey: PrivacySettings.consentChoiceMadeKey)
        UserDefaults.standard.removeObject(forKey: PrivacySettings.analyticsEnabledKey)
        // Apply the reset state to Firebase
        Analytics.setAnalyticsCollectionEnabled(false)
    }
    
    func log(event: AnalyticsEvent) {
        guard isConfigured else { return }
        
        Analytics.logEvent(event.name, parameters: event.parameters)
    }
    
    func setCurrentScreen(_ screenName: String?, screenClass: String?) {
        guard isConfigured else { return }
        
        Analytics.logEvent(AnalyticsEventScreenView, parameters: [
            AnalyticsParameterScreenName: screenName ?? "",
            AnalyticsParameterScreenClass: screenClass ?? ""
        ])
    }
    
    func setAnalyticsCollectionEnabled(_ enabled: Bool) {
        guard isConfigured else { return }
        
        Analytics.setAnalyticsCollectionEnabled(enabled)
    }
}
