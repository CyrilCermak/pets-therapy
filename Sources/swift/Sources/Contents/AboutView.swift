import Schwifty
import SwiftUI

class AboutViewModel: ObservableObject {
    private let importPet = ImportPetDragAndDropCoordinator()
    
    func importView() -> AnyView {
        importPet.view()
    }
}

struct AboutView: View {
    
    @EnvironmentObject var viewModel: AboutViewModel
    
    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: .xl) {
                PageTitle(text: Lang.Page.about)
                viewModel.importView()
                LeaveReview()
                if DeviceRequirement.iOS.isSatisfied {
                    DiscordView()
                }
                RestorePurchasesButton().padding(.vertical)
                Socials()
                if DeviceRequirement.macOS.isSatisfied {
                    ContributorsModal()
                }
                PrivacyPolicy()
                TermsAndConditions()
                AppVersion()
            }
            .multilineTextAlignment(.center)
            .padding(.md)
            .padding(.bottom, .xxxxl)
        }
    }
}

private struct AppVersion: View {
    @EnvironmentObject var appConfig: AppConfig

    var text: String {
        let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String
        let dev = isDevApp ? "Dev" : ""
        return ["v.", version ?? "n/a", dev]
            .filter { !$0.isEmpty }.joined(separator: " ")
    }

    var isDevApp: Bool {
        let bundle = Bundle.main.bundleIdentifier ?? ""
        return bundle.contains(".dev")
    }

    var body: some View {
        Text(text)
    }
}

private struct ContributorsModal: View {
    @State private var isShowingContributors: Bool = false
    
    var body: some View {
        Button(Lang.Page.contributors) {
            isShowingContributors.toggle()
        }
        .buttonStyle(.text)
        .sheet(isPresented: $isShowingContributors) {
            ContributorsView()
        }
    }
}

private struct PrivacyPolicy: View {
    var body: some View {
        Button(Lang.About.privacyPolicy) {
            URL.visit(urlString: Constants.URLs.privacy)
        }
        .buttonStyle(.text)
    }
}

private struct TermsAndConditions: View {
    var body: some View {
        Button(Lang.About.termsAndConditions) {
            URL.visit(urlString: Constants.URLs.termsAndConditions)
        }
        .buttonStyle(.text)
    }
}

private struct Socials: View {
    var body: some View {
        HStack(spacing: .xl) {
            SocialIcon(name: "github", link: Constants.URLs.github)
            SocialIcon(name: "discord", link: Constants.URLs.discord)
        }
    }
}

private struct SocialIcon: View {
    let name: String
    let link: String

    var body: some View {
        Image(name)
            .resizable()
            .antialiased(true)
            .frame(width: 32, height: 32)
            .onTapGesture { URL.visit(urlString: link) }
    }
}

private struct LeaveReview: View {
    var body: some View {
        VStack(spacing: .lg) {
            Text(Lang.About.leaveReviewMessage)
                .multilineTextAlignment(.center)
                .font(.title2.bold())
            Button(Lang.About.leaveReview) {
                URL.visit(urlString: Constants.URLs.appStore)
            }
            .buttonStyle(.regular)
        }
    }
}

private struct DiscordView: View {
    var body: some View {
        VStack(spacing: .md) {
            Text(Lang.PetSelection.joinDiscord)
            JoinOurDiscord()
        }
    }
}

struct JoinOurDiscord: View {
    var body: some View {
        Image("discordSquare")
            .resizable()
            .frame(height: 32)
            .frame(width: 32)
            .onTapGesture { URL.visit(urlString: Constants.URLs.discord) }
    }
}
