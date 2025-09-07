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
                MorePets().padding(.bottom, .xxxl)
            }
            .padding(.md)
        }
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
            if DeviceRequirement.allSatisfied(.macOS) {
                HorizontalFiltersView()
            }
            PetsGrid(
                columns: viewModel.gridColums,
                text: text,
                species: viewModel.unselectedSpecies
            )
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
