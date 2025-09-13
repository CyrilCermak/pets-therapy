import StoreKit
import SwiftUI
import Schwifty

struct RestorePurchasesButton: View {
    @EnvironmentObject var viewModel: ShopViewModel
    
    var body: some View {
        Button(Lang.Shop.restore) {
            Task {
                await viewModel.restorePurchases()
            }
        }
    }
}

struct ShamelessSubscriptionBanner: View {
    @EnvironmentObject var viewModel: ShopViewModel
    
    var body: some View {
        VStack(alignment: .center) {
            HStack {
                if viewModel.isLoading {
                    ProgressView(Lang.Shop.loading)
                        .frame(height: 32)
                } else if viewModel.hasActiveSubscription {
                    supporterBadge
                } else {
                    if let supporterProduct = viewModel.supporterSubscription {
                         makeSupporterPurchaseButton(product: supporterProduct)
                    }
                }
            }
        }
    }
    
    var supporterBadge: some View {
        HStack(spacing: 6) {
            Image(systemName: "crown.fill")
                .font(.caption.weight(.bold))
            Text(Lang.Shop.supporter)
                .font(.callout.weight(.bold))
        }
        .foregroundColor(.white)
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(
            Capsule()
                .fill(.ultraThinMaterial)
                .overlay(
                    Capsule()
                        .fill(
                            LinearGradient(
                                colors: [Color.yellow, Color.orange],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                )
                .overlay(
                    Capsule()
                        .stroke(Color.white.opacity(0.3), lineWidth: 1)
                )
                .shadow(color: .orange.opacity(0.2), radius: 8, x: 0, y: 4)
        )
    }
    
    func makeSupporterPurchaseButton(product: Product) -> some View {
        Button(action: {
            Task {
                await viewModel.purchase(product)
            }
        }) {
            HStack(spacing: .zero) {
                Text(product.displayName)
                    .fontWeight(.bold)
                
                Text(" (\(product.displayPrice) / year)")
                    .fontWeight(.semibold)
            }
            .padding(.horizontal)
            .frame(height: DesignSystem.buttonsHeight)
            .foregroundStyle(Color.white)
            .background(Color.accent)
            .cornerRadius(8)
            .shadow(radius: 8)
        }
        .buttonStyle(.plain)
    }
}
