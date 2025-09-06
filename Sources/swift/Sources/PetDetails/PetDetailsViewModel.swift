import Combine
import NotAGif
import Schwifty
import SwiftUI

protocol PetDetailsHeaderBuilder {
    func build(with viewModel: PetDetailsViewModel) -> AnyView
}

class PetDetailsViewModel: ObservableObject {
    @Inject private var appConfig: AppConfig
    @Inject private var assets: PetsAssetsProvider
    @Inject private var names: SpeciesNamesRepository
    @Inject private var headerBuilder: PetDetailsHeaderBuilder
    
    @Binding var isShown: Bool
    @Published var canBeAdded = true
    @Published var title: String = ""

    let species: Species
    let speciesAbout: String
    var canRemove: Bool { isSelected }
    var canSelect: Bool { !isSelected }
    var isPaid: Bool { species.tags.contains(kTagSupporters)}
    var isSelected: Bool { appConfig.isSelected(species.id) }

    var animationFrames: [ImageFrame] {
        assets.images(for: species.id, animation: "front")
    }

    var animationFps: TimeInterval {
        max(3, species.fps)
    }

    private var disposables = Set<AnyCancellable>()

    init(isShown: Binding<Bool>, species: Species) {
        _isShown = isShown
        speciesAbout = Lang.Species.about(for: species.id)
        self.species = species
        bindTitle()
    }

    func close() {
        withAnimation {
            isShown = false
        }
    }

    func selected() {
        appConfig.select(species.id)
        close()
    }

    func remove() {
        appConfig.deselect(species.id)
        close()
    }

    func didAppear() {
        // ...
    }

    private func bindTitle() {
        names.name(forSpecies: species.id)
            .sink { [weak self] name in self?.title = name }
            .store(in: &disposables)
    }
}
