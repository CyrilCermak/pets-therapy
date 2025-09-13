import Foundation
import Schwifty

enum Lang {
    static let appName = "appName".localized()
    static let cancel = "cancel".localized()
    static let delete = "delete".localized()
    static let disable = "disable".localized()
    static let done = "done".localized()
    static let enable = "enable".localized()
    static let loading = "loading".localized()
    static let no = "no".localized()
    static let ok = "ok".localized()
    static let remove = "remove".localized()
    static let reset = "reset".localized()
    static let screen = "screen".localized()
    static let select = "select".localized()
    static let somethingWentWrong = "somethingWentWrong".localized()
    static let yes = "yes".localized()

    enum About {
        static let leaveReview = "about.leaveReview".localized()
        static let leaveReviewMessage = "about.leaveReviewMessage".localized()
        static let privacyPolicy = "about.privacyPolicy".localized()
        static let termsAndConditions = "about.termsAndConditions".localized()
    }

    enum Analytics {
        static let consentTitle = "analytics.consentTitle".localized()
        static let consentMessage = "analytics.consentMessage".localized()
        static let consentAccept = "analytics.consentAccept".localized()
        static let consentDecline = "analytics.consentDecline".localized()
        static let privacyNote = "analytics.privacyNote".localized()
        static let settingsToggleLabel = "analytics.settingsToggleLabel".localized()
    }

    enum Backgrounds {
        static let BackgroundMountainDay = "backgrounds.BackgroundMountainDay".localized()
        static let BackgroundMountainDynamic = "backgrounds.BackgroundMountainDynamic".localized()
        static let BackgroundMountainNight = "backgrounds.BackgroundMountainNight".localized()
        static let title = "backgrounds.title".localized()
    }

    enum Contributors {
        static let artist = "contributors.artist".localized()
        static let developer = "contributors.developer".localized()
        static let moderator = "contributors.moderator".localized()
        static let owner = "contributors.owner".localized()
        static let patreon = "contributors.patreon".localized()
        static let translator = "contributors.translator".localized()
    }

    enum CustomPets {
        static let breakingChanges240Title = "customPets.breakingChanges240Title".localized()
        static let breakingChanges240Message = "customPets.breakingChanges240Message".localized()
        static let customPetDescription = "customPets.customPetDescription".localized()
        static let dragAreaMessage = "customPets.dragAreaMessage".localized()
        static let export = "customPets.export".localized()
        static let exportSuccess = "customPets.exportSuccess".localized()
        static let exportSuccessMessage = "customPets.exportSuccessMessage".localized()
        static let genericImportError = "customPets.genericImportError".localized()
        static let genericExportError = "customPets.genericExportError".localized()
        static let importSuccess = "customPets.importSuccess".localized()
        static let invalidJson = "customPets.invalidJson".localized()
        static let message = "customPets.message".localized()
        static let missingFiles = "customPets.missingFiles".localized()
        static let setNameTitle = "customPets.setNameTitle".localized()
        static let setNameMessage = "customPets.setNameMessage".localized()
        static let readTheDocs = "customPets.readTheDocs".localized()
        static let speciesAlreadyExists = "customPets.speciesAlreadyExists".localized()
        static let title = "customPets.title".localized()
    }

    enum Donations {
        static let linkTitle = "donations.linkTitle".localized()
        static let message = "donations.message".localized()
        static let title = "donations.title".localized()
    }

    enum Onboarding {
        static let title = "onboarding.title".localized()
        static let message = "onboarding.message".localized()
        static let customPetsTitle = "onboarding.customPetsTitle".localized()
        static let customPetsMessage = "onboarding.customPetsMessage".localized()
    }

    enum Page {
        static let about = "page.about".localized()
        static let contributors = "page.contributors".localized()
        static let help = "page.help".localized()
        static let screensaver = "page.screensaver".localized()
        static let petSelection = "page.petSelection".localized()
        static let settings = "page.settings".localized()
    }
    
    enum PetSelection {
        static let addPet = "petSelection.addPet".localized()
        static let designedBy = "petSelection.designedBy".localized()
        static let fixOnScreenPets = "petSelection.fixOnScreenPets".localized()
        static let joinDiscord = "petSelection.joinDiscord".localized()
        static let morePets = "petSelection.morePets".localized()
        static let petSelection = "petSelection.petSelection".localized()
        static let yourPets = "petSelection.yourPets".localized()
    }
    
    enum Shop {
        static let loading = "shop.loading".localized()
        static let thankYou = "shop.thankYou".localized()
        static let restore = "shop.restore".localized()
        static let becomeSupporter = "shop.becomeSupporter".localized()
        static let supporter = "shop.supporter".localized()
        static let pleeeease = "shop.pleeeease".localized()
        static let theseAreOnlyForSupporters = "shop.theseAreOnlyForSupporters".localized()
    }

    enum Settings {
        static let bounceOffPets = "settings.bounceOffPets".localized()
        static let desktopInteractionsMessage = "settings.desktopInteractionsMessage".localized()
        static let desktopInteractionsTitle = "settings.desktopInteractionsTitle".localized()
        static let enabledDisplays = "settings.enabledDisplays".localized()
        static let floatOverFullscreenApps = "settings.floatOverFullscreenApps".localized()
        static let gravity = "settings.gravity".localized()
        static let launchAtLogin = "settings.launchAtLogin".localized()
        static let anonymousTrackingTitle = "settings.anonymousTrackingTitle".localized()
        static let anonymousTrackingMessage = "settings.anonymousTrackingMessage".localized()
        static let launchAtLoginPromo = "settings.launchAtLoginPromo".localized()
        static let launchSilentlyTitle = "settings.launchSilentlyTitle".localized()
        static let launchSilentlyMessage = "settings.launchSilentlyMessage".localized()
        static let randomEventsTitle = "settings.randomEventsTitle".localized()
        static let randomEventsMessage = "settings.randomEventsMessage".localized()
        static let size = "settings.size".localized()
        static let speed = "settings.speed".localized()
        static let statusBarIconEnabled = "settings.statusBarIconEnabled".localized()
        static let useImageInterpolation = "settings.useImageInterpolation".localized()
    }

    enum Tag {
        static let all = "tag.all".localized()
    }
}

extension Lang {
    enum Species {
        static func name(for id: String) -> String {
            let fallback = id.replacingOccurrences(of: "_", with: " ").capitalized
            return "species.name.\(id)".localized(or: fallback)
        }

        static func about(for id: String) -> String {
            "species.about.\(id)".localized(or: Lang.CustomPets.customPetDescription)
        }
    }
}

extension AppPage: CustomStringConvertible {
    var description: String {
        switch self {
        case .about: return Lang.Page.about
        case .petSelection: return Lang.Page.petSelection
        case .screensaver: return Lang.Page.screensaver
        case .settings: return Lang.Page.settings
        case .none: return "???"
        }
    }
}

extension Lang {
    static func name(forMenuItem item: String) -> String {
        "menu.\(item)".localized()
    }

    static func name(forTag tag: String) -> String {
        "tag.\(tag)".localized(or: tag)
    }
}
