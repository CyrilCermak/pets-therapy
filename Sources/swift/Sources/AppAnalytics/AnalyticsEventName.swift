// 
// Pet Therapy.
// 

import Foundation

enum AnalyticsEventName: String, CaseIterable {
    case appLaunch = "app_launch"
    case error = "error"
    case petSelected = "pet_selected"
    
    var rawValue: String {
        switch self {
        case .appLaunch: return "app_launch"
        case .petSelected: return "pet_selected"
        case .error: return "error"
        }
    }
}

struct AnalyticsParameterName {
    static let featureName = "feature_name"
    static let action = "action"
    static let target = "target"
    static let errorDescription = "error_description"
    static let context = "context"
    static let petSpecies = "pet_species"
    static let settingName = "setting_name"
    static let settingValue = "setting_value"
    static let themeName = "theme_name"
    static let itemId = "item_id"
    static let itemName = "item_name"
}
