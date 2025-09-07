import Combine
import Foundation
import Schwifty
import SwiftUI

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
    @Published var selectedTag = "featured"

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
        
        // Define the priority order for the new tag system
        let priorityTags = [
            "featured",
            "supporters-only",
            "free",
            "cats-dogs",
            "wild-animals",
            "characters",
            "memes-fun"
        ]
        
        // Add priority tags first if they exist in species
        for priorityTag in priorityTags where allSpeciesTags.contains(priorityTag) {
            sortedTags.append(priorityTag)
        }
        
        // Adding free category
        if let supportersIndex = sortedTags.firstIndex(of: "supporters-only") {
            sortedTags.insert("free", at: supportersIndex + 1)
        }
        
        // Add any remaining tags alphabetically
        let remainingTags = allSpeciesTags
            .filter { !priorityTags.contains($0) && $0 != kTagAll && $0 != kTagSupporters }
            .sorted()
        
        sortedTags.append(contentsOf: remainingTags)
        
        // Insert "All" at the beginning
        sortedTags.insert(kTagAll, at: 0)
        
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
                petsSelection.filterChanged(to: tag == kTagAll ? nil : tag)
            }
    }
}

private let kTagAll = "all"
let kTagSupporters = "supporters-only"
