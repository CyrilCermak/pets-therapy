import NotAGif
import Schwifty
import SwiftUI

struct PetDetailsView: View {
    @StateObject private var viewModel: PetDetailsViewModel
    @EnvironmentObject var shop: ShopViewModel

    init(isShown: Binding<Bool>, species: Species) {
        _viewModel = StateObject(wrappedValue: PetDetailsViewModel(isShown: isShown, species: species))
    }

    var body: some View {
        VStack(spacing: .xl) {
            PetDetailsHeader()
            AnimatedPreview()
            AnimationSelector()
            About()
            if DeviceRequirement.iOS.isSatisfied { Spacer() }
            Footer()
        }
        .padding(.lg)
        .frame(when: .is(.macOS), width: 450)
        .onAppear { viewModel.didAppear() }
        .onDisappear { shop.resetPurchaseState() }
        .environmentObject(viewModel)
    }
}

private struct About: View {
    @EnvironmentObject var viewModel: PetDetailsViewModel

    var body: some View {
        Text(viewModel.speciesAbout)
            .lineLimit(10)
            .multilineTextAlignment(.center)
            .fixedSize(horizontal: false, vertical: true)
    }
}

private struct AnimatedPreview: View {
    @EnvironmentObject var viewModel: PetDetailsViewModel

    var body: some View {
        VStack(spacing: .md) {
            ZStack {
                AnimatedContent(frames: viewModel.animationFrames, fps: viewModel.animationFps) { frame in
                    Image(frame: frame)
                        .pixelArt()
                        .frame(width: 150, height: 150)
                }
                .id(viewModel.selectedAnimation)
                .transition(.opacity)
            }
            .frame(width: 150, height: 150)
            .animation(.easeInOut(duration: 0.1), value: viewModel.selectedAnimation)
        }
    }
}

private struct AnimationSelector: View {
    @EnvironmentObject var viewModel: PetDetailsViewModel
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: .sm) {
                ForEach(viewModel.animations, id: \.self) { animation in
                    Button(action: { viewModel.selectAnimation(animation) }) {
                        Text(animation.capitalized)
                            .font(.title3)
                            .padding(.horizontal, .sm)
                            .padding(.vertical, .xs)
                            .background(
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(viewModel.selectedAnimation == animation ? 
                                          Color.accent : Color.secondary.opacity(0.2))
                            )
                            .foregroundColor(viewModel.selectedAnimation == animation ? 
                                           .white : .primary)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .padding(.horizontal, .md)
        }
    }
}

private struct Footer: View {
    @EnvironmentObject var viewModel: PetDetailsViewModel
    @EnvironmentObject var shop: ShopViewModel

    var axis: Axis.Set {
        DeviceRequirement.allSatisfied(.iOS, .portrait) ? .vertical : .horizontal
    }

    var body: some View {
        VStack(alignment: .center) {
            if !shop.purchaseStatus.isEmpty {
                Text(shop.purchaseStatus)
                    .foregroundColor(shop.purchaseStatusColor)
            }
            VHStack(axis) {
                if viewModel.canSelect && viewModel.canBeAdded {
                    if viewModel.isPaid && !shop.hasActiveSubscription {
                        ShamelessSubscriptionBanner()
                    } else {
                        Button(Lang.PetSelection.addPet, action: viewModel.selected)
                            .buttonStyle(.regular)
                    }
                }
                if viewModel.canRemove {
                    Button(Lang.remove, action: viewModel.remove)
                        .buttonStyle(.regular)
                }
                
                Button(Lang.cancel, action: viewModel.close)
                    .buttonStyle(.text)
            }
        }
    }
}

#Preview {
    PetDetailsView(isShown: Binding<Bool>.init(get: {true}, set: { _ in }),
                   species: Species(id: "ape"))
}
