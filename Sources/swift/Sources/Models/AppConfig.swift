import Combine
import Schwifty
import SwiftUI

class AppConfig: ObservableObject {
    @Inject private var storage: AppConfigStorage
    @Inject private var analytics: AnalyticsService
    
    @Published var background: String = "BackgroundMountainDynamic"
    @Published var desktopInteractions: Bool = true
    @Published var floatOverFullscreenApps: Bool = true
    @Published var disabledScreens: [String] = []
    @Published var gravityEnabled = true
    @Published var bounceOffPetsEnabled = false
    @Published var launchSilently = false {
        didSet {
            if launchSilently {
                showInMenuBar = true
            }
        }
    }

    @Published var names: [String: String] = [:]
    @Published var petSize: CGFloat = PetSize.defaultSize
    @Published var randomEvents = true
    @Published var showInMenuBar = true {
        didSet {
            if !showInMenuBar {
                launchSilently = false
            }
            if showInMenuBar && !oldValue {
                StatusBarCoordinator.shared.show()
            }
        }
    }

    @Published var speedMultiplier: CGFloat = 1
    @Published private(set) var selectedSpecies: [String] = []

    private var cancellabels = Set<AnyCancellable>()
    
    init() {
        readFromStorage()
        storage.storeValues(of: self)
        observeEvents()
    }

    func isEnabled(screen: Screen) -> Bool {
        !disabledScreens.contains(screen.id)
    }

    func set(screen: Screen, enabled: Bool) {
        if enabled {
            disabledScreens.remove(screen.id)
        } else {
            disabledScreens.append(screen.id)
        }
    }

    func isSelected(_ species: String) -> Bool {
        selectedSpecies.contains(species)
    }

    func replaceSelectedSpecies(with species: [String]) {
        selectedSpecies = species
    }

    func select(_ species: String) {
        deselect(species)
        selectedSpecies.append(species)
        
        analytics.log(event: AppAnalyticsEvent.selected(petId: species))
    }

    func deselect(_ species: String) {
        selectedSpecies.remove(species)
        
        analytics.log(event: AppAnalyticsEvent.deselected(petId: species))
    }

    func rename(species: String, to newName: String) {
        names[species] = newName
        
        analytics.log(event: AppAnalyticsEvent.renamed(petId: species))
    }

    private func readFromStorage() {
        background = storage.background
        bounceOffPetsEnabled = storage.bounceOffPetsEnabled
        desktopInteractions = storage.desktopInteractions
        gravityEnabled = storage.gravityEnabled
        launchSilently = storage.launchSilently
        names = storage.names
        petSize = storage.petSize
        selectedSpecies = storage.selectedSpecies
        speedMultiplier = storage.speedMultiplier
        disabledScreens = storage.disabledScreens
        randomEvents = storage.randomEvents
        showInMenuBar = storage.showInMenuBar
        floatOverFullscreenApps = storage.floatOverFullscreenApps
    }
    
    private func observeEvents() {
        $background
            .dropFirst()
            .removeDuplicates()
            .sink { [weak self] name in
                self?.analytics.log(event: AppAnalyticsEvent.selectedBackground(id: name))
            }
            .store(in: &cancellabels)
        
        $desktopInteractions
            .dropFirst()
            .removeDuplicates()
            .sink { [weak self] enabled in
                self?.analytics.log(event: AppAnalyticsEvent.interactions(enabled: enabled))
            }
            .store(in: &cancellabels)
        
        $floatOverFullscreenApps
            .dropFirst()
            .removeDuplicates()
            .sink { [weak self] enabled in
                self?.analytics.log(event: AppAnalyticsEvent.floatOverFullScreen(enabled: enabled))
            }
            .store(in: &cancellabels)
        
        $gravityEnabled
            .dropFirst()
            .removeDuplicates()
            .sink { [weak self] enabled in
                self?.analytics.log(event: AppAnalyticsEvent.gravity(enabled: enabled))
            }
            .store(in: &cancellabels)
        
        $bounceOffPetsEnabled
            .dropFirst()
            .removeDuplicates()
            .sink { [weak self] enabled in
                self?.analytics.log(event: AppAnalyticsEvent.bounceOffPets(enabled: enabled))
            }
            .store(in: &cancellabels)
        
        $randomEvents
            .dropFirst()
            .removeDuplicates()
            .sink { [weak self] enabled in
                self?.analytics.log(event: AppAnalyticsEvent.randomEvents(enabled: enabled))
            }
            .store(in: &cancellabels)
        
    }
}

extension Screen: @retroactive Identifiable {
    public var id: String { localizedName.lowercased() }
}
