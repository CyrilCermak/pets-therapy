import Foundation
import FirebaseAnalytics
import FirebaseCore

final class AnalyticsServiceImpl: AnalyticsService {
    // MARK: - Privacy Settings
    struct PrivacySettings {
        /// Key for storing analytics enabled state in UserDefaults
        static let analyticsEnabledKey = "AnalyticsEnabled"
        
        /// Default analytics enabled state (should be false for privacy-first approach)
        static let defaultAnalyticsEnabled = true
    }
    
    private var isConfigured = false
    private var _isAnalyticsEnabled: Bool {
        get { UserDefaults.standard.bool(forKey: PrivacySettings.analyticsEnabledKey) }
        set { UserDefaults.standard.set(newValue, forKey: PrivacySettings.analyticsEnabledKey) }
    }
    
    var isAnalyticsEnabled: Bool {
        return _isAnalyticsEnabled
    }
    
    func configure() {
        guard !isConfigured else { return }
        
        FirebaseApp.configure()
        isConfigured = true
        
        // Set initial analytics state from UserDefaults
        // If never set before, use privacy-first default (disabled)
        if UserDefaults.standard.object(forKey: PrivacySettings.analyticsEnabledKey) == nil {
            _isAnalyticsEnabled = PrivacySettings.defaultAnalyticsEnabled
        }
        
        // Apply the current analytics state to Firebase
        Analytics.setAnalyticsCollectionEnabled(PrivacySettings.defaultAnalyticsEnabled)
    }
    
    func setAnalyticsEnabled(_ enabled: Bool) {
        _isAnalyticsEnabled = enabled
        Analytics.setAnalyticsCollectionEnabled(enabled)
    }
    
    func log(event: AnalyticsEvent) {
        guard isConfigured else {
            print("⚠️ Analytics not configured. Call configure() first.")
            return
        }
        
        guard isAnalyticsEnabled else {
            return // Silently ignore if analytics is disabled
        }
        
        Analytics.logEvent(event.name, parameters: event.parameters)
    }
    
    func setCurrentScreen(_ screenName: String?, screenClass: String?) {
        guard isConfigured else {
            print("⚠️ Analytics not configured. Call configure() first.")
            return
        }
        
        guard _isAnalyticsEnabled else {
            return // Silently ignore if analytics is disabled
        }
        
        Analytics.logEvent(AnalyticsEventScreenView, parameters: [
            AnalyticsParameterScreenName: screenName ?? "",
            AnalyticsParameterScreenClass: screenClass ?? ""
        ])
    }
    
    func setAnalyticsCollectionEnabled(_ enabled: Bool) {
        Analytics.setAnalyticsCollectionEnabled(enabled)
    }
}
