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
        HStack {
            if !viewModel.purchaseStatus.isEmpty {
                Text(viewModel.purchaseStatus)
                    .foregroundColor(viewModel.purchaseStatusColor)
                    .padding(.horizontal)
                    .frame(height: 32)
            }
            
            if viewModel.isLoading {
                ProgressView(Lang.Shop.loading)
                    .frame(height: 32)
            } else if viewModel.hasActiveSubscription {
                Text(Lang.Shop.thankYou)
                    .frame(maxWidth: 300)
                    .font(.headline)
                    .frame(height: 32)
            } else {
                if let supporterProduct = viewModel.supporterSubscription {
                    Button(action: {
                        Task {
                            await viewModel.purchase(supporterProduct)
                        }
                    }) {
                        HStack(spacing: .zero) {
                            Text(supporterProduct.displayName)
                                .fontWeight(.bold)
                            
                            Text(" (\(supporterProduct.displayPrice) / year)")
                                .fontWeight(.semibold)
                        }
                        .padding(.horizontal)
                        .frame(height: 32)
                        .foregroundStyle(Color.white)
                        .background(Color.accent)
                        .cornerRadius(8)
                        .shadow(radius: 8)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .onAppear {
            Task {
                await viewModel.fetchProduct()
                await viewModel.checkCurrentEntitlements()
            }
        }
    }
}
