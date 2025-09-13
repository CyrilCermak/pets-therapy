import Foundation

/// Service for tracking analytics events throughout the application
protocol AnalyticsService {
    /// Check if analytics is currently enabled
    var isAnalyticsEnabled: Bool { get }
    
    /// Check if user has made a consent choice
    var hasUserMadeConsentChoice: Bool { get }
    
    /// Configure Analytics (should be called during app initialization)
    func configure()
    
    /// Enable or disable analytics data collection
    /// - Parameter enabled: Whether analytics collection should be enabled
    func setAnalyticsEnabled(_ enabled: Bool)
    
    /// Reset all consent choices and analytics settings
    /// This will cause the consent dialog to appear again
    func resetConsentChoice()
    
    /// Log a custom event with optional parameters
    /// - Parameters:
    ///   - name: The analytics event name using the type-safe enum
    ///   - parameters: Optional dictionary of event parameters (up to 25 parameters per event)
    /// - Note: This method will do nothing if analytics is disabled
    func log(event: AnalyticsEvent)
    
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
