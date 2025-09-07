import Combine
import Foundation
import Schwifty
import SwiftUI

enum PetTag: String, CaseIterable {
    case all = "all"
    case featured = "featured"
    case supportersOnly = "supporters-only"
    case free = "free"
    case catsDogs = "cats-dogs"
    case wildAnimals = "wild-animals"
    case characters = "characters"
    case memesFun = "memes-fun"
    
    static let priorityOrder: [PetTag] = [
        .featured,
        .supportersOnly,
        .free,
        .catsDogs,
        .wildAnimals,
        .characters,
        .memesFun
    ]
}

struct HorizontalFiltersView: View {
    @StateObject private var viewModel = FiltersViewModel()

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: .sm) {
                ForEach(viewModel.availableTags, id: \.self) {
                    TagView(tag: $0)
                }
            }
            .padding(.horizontal, .sm)
        }
        .environmentObject(viewModel)
    }
}

private class FiltersViewModel: ObservableObject {
    @Inject private var speciesProvider: SpeciesProvider

    @Published var availableTags: [String] = []
    @Published var selectedTag = PetTag.featured.rawValue

    private var disposables = Set<AnyCancellable>()

    init() {
        Publishers.CombineLatest(speciesProvider.all(), $selectedTag)
            .receive(on: DispatchQueue.main)
            .sink { [weak self] species, tag in
                self?.loadTags(from: species, selectedTag: tag)
            }
            .store(in: &disposables)
    }

    private func loadTags(from species: [Species], selectedTag: String?) {
        let allSpeciesTags = species
            .flatMap { $0.tags }
            .removeDuplicates(keepOrder: false)
        
        var sortedTags: [String] = []
        
        // Add priority tags first if they exist in species
        for priorityTag in PetTag.priorityOrder where allSpeciesTags.contains(priorityTag.rawValue) {
            sortedTags.append(priorityTag.rawValue)
        }
        
        // Adding free category
        if let supportersIndex = sortedTags.firstIndex(of: PetTag.supportersOnly.rawValue) {
            sortedTags.insert(PetTag.free.rawValue, at: supportersIndex + 1)
        }
        
        // Add any remaining tags alphabetically
        let priorityTagStrings = PetTag.priorityOrder.map(\.rawValue)
        let remainingTags = allSpeciesTags
            .filter { !priorityTagStrings.contains($0) && $0 != PetTag.all.rawValue && $0 != PetTag.supportersOnly.rawValue }
            .sorted()
        
        sortedTags.append(contentsOf: remainingTags)
        
        // Insert "All" at the beginning
        sortedTags.insert(PetTag.all.rawValue, at: 0)
        
        availableTags = sortedTags
    }

    func isSelected(tag: String) -> Bool {
        selectedTag == tag
    }

    func toggleSelection(tag: String) {
        withAnimation {
            selectedTag = tag
        }
    }
}

private struct TagView: View {
    @EnvironmentObject var petsSelection: PetsSelectionViewModel
    @EnvironmentObject var viewModel: FiltersViewModel

    let tag: String

    var isSelected: Bool {
        viewModel.isSelected(tag: tag)
    }

    var background: Color {
        isSelected ? .accent : .white.opacity(0.8)
    }

    var foreground: Color {
        isSelected ? .white : .black.opacity(0.8)
    }

    var body: some View {
        Text(Lang.name(forTag: tag).uppercased())
            .font(.headline)
            .padding(.horizontal, .sm)
            .frame(height: DesignSystem.tagsHeight)
            .background(background)
            .cornerRadius(DesignSystem.tagsHeight / 2)
            .foregroundColor(foreground)
            .onTapGesture {
                viewModel.toggleSelection(tag: tag)
                petsSelection.filterChanged(to: tag == PetTag.all.rawValue ? nil : tag)
            }
    }
}


