import Combine
import Schwifty
import SwiftUI

struct PetsGrid: View {
    let columns: [GridItem]
    let text: String?    
    let species: [Species]

    var body: some View {
        VStack(spacing: .md) {
            if let text {
                Text(text)
                    .textAlign(.leading)
                    .foregroundStyle(Color.white)
            }
            LazyVGrid(columns: columns, spacing: Spacing.xl.rawValue) {
                ForEach(species, id: \.id) {
                    PetPreview(species: $0)
                }
            }
        }
    }
}

private struct Title: View {
    let title: String

    var body: some View {
        Text(title)
            .textAlign(.leading)
            .font(.title2)
    }
}
