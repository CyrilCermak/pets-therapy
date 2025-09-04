import Schwifty
import SwiftUI

struct PageTitle: View {
    let text: String

    var body: some View {
        HStack {
            Text(text).font(.boldTitle)
            Spacer()
            if DeviceRequirement.macOS.isSatisfied {
                ShamelessSubscriptionBanner()
                JoinOurDiscord()
            }
        }
    }
}
