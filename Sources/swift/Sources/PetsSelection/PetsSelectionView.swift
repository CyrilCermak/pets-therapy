import Schwifty
import SwiftUI

struct PetsSelectionView: View {
    @StateObject var viewModel: PetsSelectionViewModel

    init() {
        _viewModel = StateObject(wrappedValue: PetsSelectionViewModel())
    }

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: .xxl) {
                MyPets()
                    .id("my-pets")
                MorePets()
                    .id("more-pets")
                    .padding(.bottom, .xxxl)
            }
            .padding(.md)
        }
        .animation(.easeInOut(duration: 0.2), value: viewModel.selectedSpecies.count)
        .sheet(isPresented: viewModel.showingDetails) {
            if let species = viewModel.openSpecies {
                PetDetailsView(
                    isShown: viewModel.showingDetails,
                    species: species
                )
            }
        }
        .environmentObject(viewModel)
    }
}

private struct MyPets: View {
    @EnvironmentObject var viewModel: PetsSelectionViewModel

    var body: some View {
        VStack(spacing: .md) {
            HStack {
                Title(text: Lang.PetSelection.yourPets)
                if DeviceRequirement.macOS.isSatisfied {
                    ShamelessSubscriptionBanner()
                    JoinOurDiscord()
                }
            }
            PetsGrid(
                columns: viewModel.gridColums,
                text: nil,
                species: viewModel.selectedSpecies
            )
            .id("selected-pets-grid-\(viewModel.selectedSpecies.count)")
        }
    }
}

private struct MorePets: View {
    @EnvironmentObject var viewModel: PetsSelectionViewModel
    @EnvironmentObject var shopViewModel: ShopViewModel
    
    var body: some View {
        VStack(spacing: .md) {
            Title(text: Lang.PetSelection.morePets)
            GridAndFiltersVerticallyStacked(
                text: {
                    if viewModel.selectedTag != PetTag.supportersOnly.rawValue { return nil }
                    if shopViewModel.hasActiveSubscription { return nil }                        
                    return Lang.Shop.theseAreOnlyForSupporters
                }()
            )
        }
    }
}

private struct GridAndFiltersVerticallyStacked: View {
    @EnvironmentObject var viewModel: PetsSelectionViewModel
    
    let text: String?
    
    var body: some View {
        VStack(spacing: .lg) {
            HorizontalFiltersView()
            PetsGrid(
                columns: viewModel.gridColums,
                text: text,
                species: viewModel.unselectedSpecies
            )
            .id("unselected-pets-grid-\(viewModel.selectedTag ?? "all")-\(viewModel.unselectedSpecies.count)")
            Spacer()
        }
    }
}

private struct Title: View {
    let text: String

    var body: some View {
        Text(text)
            .font(.title.bold())
            .textAlign(.leading)
    }
}
