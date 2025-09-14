// 
// Pet Therapy.
// 

import Foundation

enum AppAnalyticsEvent: AnalyticsEvent {
    // General
    case appLaunch
    case error(error: Error, context: String)
    case analyticsConsent(accepted: Bool)
    // Pets
    case selected(petId: String)
    case deselected(petId: String)
    case renamed(petId: String)
    // Configuration
    case interactions(enabled: Bool)
    case selectedBackground(id: String)
    case floatOverFullScreen(enabled: Bool)
    case gravity(enabled: Bool)
    case bounceOffPets(enabled: Bool)
    case randomEvents(enabled: Bool)
    
    var name: String {
        switch self {
        case .appLaunch: return "app_launch"
        case .selected: return "selected"
        case .deselected: return "deselected"
        case .error: return "error"
        case .analyticsConsent: return "analytics_consent"
        case .renamed: return "renamed_pet"
        case .selectedBackground: return "selected_background"
        case .interactions: return "interactions"
        case .floatOverFullScreen: return "float_over_full_screen"
        case .gravity: return "gravity"
        case .bounceOffPets: return "bounce_off_pets"
        case .randomEvents: return "random_events"
        }
    }
    
    var parameters: [String: Any] {
        switch self {
        case .error(let error, let context):
            return [
                "errorDescription": error.localizedDescription,
                "context": context
            ]
        case .analyticsConsent(let accepted):
            return ["accepted": accepted]
        case .selected(let petId):
            return ["pet": petId]
        case .deselected(let petId):
            return ["pet": petId]
        case .selectedBackground(let id):
            return ["name": id]
        case .interactions(let enabled):
            return ["enabled": enabled]
        case .floatOverFullScreen(let enabled):
            return ["enabled": enabled]
        case .gravity(let enabled):
            return ["enabled": enabled]
        case .bounceOffPets(let enabled):
            return ["enabled": enabled]
        case .randomEvents(let enabled):
            return ["enabled": enabled]
        case .appLaunch, .renamed: return [:]
        }
    }
}
