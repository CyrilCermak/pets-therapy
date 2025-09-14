import SwiftUI
import StoreKit
import Schwifty

class ShopViewModel: ObservableObject {
    @Published var supporterSubscription: Product?
    @Published var purchaseStatus: String = ""
    @Published var hasActiveSubscription: Bool = false
    @Published var isLoading: Bool = true
    @Published var purchaseStatusColor: Color = .white
    
    private let supporterSubscriptionID = "supporter001"
    
    private var productIDs: [String] {
        [supporterSubscriptionID]
    }
    
    private var transactionListenerTask: Task<Void, Never>? = nil
    
    init() {
        listenForTransactions()
        
        Task {
            await fetchProduct()
            await checkCurrentEntitlements()
        }
    }
    
    deinit {
        transactionListenerTask?.cancel()
    }
    
    private func listenForTransactions() {
        transactionListenerTask = Task.detached { [weak self] in
            guard let self = self else { return }
            
            for await result in Transaction.updates {
                do {
                    let transaction = try result.payloadValue
                    
                    if transaction.productID == self.supporterSubscriptionID {
                        await self.checkCurrentEntitlements()
                        await setPurchaseStatus("", .white)
                    }
                    
                    await transaction.finish()
                    transactionListenerTask?.cancel()
                } catch {
                    await setPurchaseStatus(error.localizedDescription, .red)
                    transactionListenerTask?.cancel()
                }
            }
        }
    }
    
    private func setPurchaseStatus(_ text: String, _ color: Color) async {
        await MainActor.run {
            self.purchaseStatus = text
            self.purchaseStatusColor = color
        }
    }
    
    func fetchProduct() async {
        let products = try? await Product.products(for: productIDs)
        let product = products?.first { $0.id == supporterSubscriptionID }
        
        await MainActor.run {
            supporterSubscription = product
            isLoading = false
            
            if product != nil {
                purchaseStatus = "Failed to fetch products!"
            } else {
                purchaseStatus = ""
            }
        }
    }
    
    func checkCurrentEntitlements() async {
        guard !hasActiveSubscription else {
            return
        }
        
        var activeSubscription = false
        for await result in Transaction.currentEntitlements {
            do {
                let transaction = try result.payloadValue
                if let date = transaction.expirationDate, date < Date() {
                    continue
                }
                if transaction.productID == supporterSubscriptionID {
                    activeSubscription = true
                    break
                }
            } catch {
                print("Failed to parse transaction: \(error)")
            }
        }
        
        if activeSubscription {
            await MainActor.run { hasActiveSubscription = true }
            await setPurchaseStatus("", .white)
        } else {
            await MainActor.run { hasActiveSubscription = false }
            await setPurchaseStatus("", .white)
        }
    }
    
    func purchase(_ product: Product) async {
        do {
            let result = try await product.purchase()
            
            switch result {
            case .success(let verificationResult):
                switch verificationResult {
                case .verified(let transaction):
                    await transaction.finish()
                    await setPurchaseStatus("", .white)
                    await MainActor.run { hasActiveSubscription = true }
                case .unverified(_, let error):
                    await setPurchaseStatus(error.localizedDescription, .red)
                }
            case .userCancelled:
                await setPurchaseStatus("", .white)
            default:
                break
            }
        } catch {
            await setPurchaseStatus(error.localizedDescription, .red)
        }
    }
    
    func restorePurchases() async {
        try? await AppStore.sync()
        await checkCurrentEntitlements()
    }
    
    func resetPurchaseState() {
        self.purchaseStatus = ""
        self.purchaseStatusColor = .white
    }
}
