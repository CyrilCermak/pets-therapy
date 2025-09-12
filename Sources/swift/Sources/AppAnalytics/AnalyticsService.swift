import Foundation

/// Service for tracking analytics events throughout the application
protocol AnalyticsService {
    /// Configure Firebase Analytics (should be called during app initialization)
    func configure()
    
    /// Check if analytics is currently enabled
    var isAnalyticsEnabled: Bool { get }
    
    /// Enable or disable analytics data collection
    /// - Parameter enabled: Whether analytics collection should be enabled
    func setAnalyticsEnabled(_ enabled: Bool)
    
    /// Log a custom event with optional parameters
    /// - Parameters:
    ///   - name: The analytics event name using the type-safe enum
    ///   - parameters: Optional dictionary of event parameters (up to 25 parameters per event)
    /// - Note: This method will do nothing if analytics is disabled
    func logEvent(_ name: AnalyticsEventName, parameters: [String: Any]?)
    
    /// Set the current screen name for analytics
    /// - Parameters:
    ///   - screenName: The name of the current screen
    ///   - screenClass: The class of the current screen (optional)
    /// - Note: This method will do nothing if analytics is disabled
    func setCurrentScreen(_ screenName: String?, screenClass: String?)
    
    /// Enable or disable analytics data collection at Firebase level
    /// - Parameter enabled: Whether analytics collection should be enabled
    /// - Note: This is a lower-level Firebase setting, prefer setAnalyticsEnabled() for user opt-out
    func setAnalyticsCollectionEnabled(_ enabled: Bool)
}

// MARK: - Convenience Methods
extension AnalyticsService {
    /// Log an event without parameters
    func logEvent(_ name: AnalyticsEventName) {
        logEvent(name, parameters: nil)
    }
    
    /// Log app launch event
    func logAppLaunch() {
        logEvent(.appLaunch)
    }
    
    /// Log feature usage
    func logFeatureUsed(_ featureName: String) {
        logEvent(.featureUsed, parameters: [
            AnalyticsParameterName.featureName: featureName
        ])
    }
    
    /// Log error event
    func logError(_ error: Error, context: String? = nil) {
        var parameters: [String: Any] = [
            AnalyticsParameterName.errorDescription: error.localizedDescription
        ]
        if let context = context {
            parameters[AnalyticsParameterName.context] = context
        }
        logEvent(.error, parameters: parameters)
    }
}
