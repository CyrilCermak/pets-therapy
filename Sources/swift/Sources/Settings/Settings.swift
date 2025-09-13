import Schwifty
import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appConfig: AppConfig

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: .xl) {
                PageTitle(text: Lang.Page.settings)
                VStack(spacing: .xl) {
                    Switches()
                    FixOnScreenPets()
                    ScreensOnOffSettings()
                    BackgroundSettings()
                }
                .frame(when: .any(.macOS, .iPad, .landscape), width: 350)
                .positioned(.leading)
                .padding(.bottom, .xxxxl)
            }
            .padding(.md)
        }
    }
}

private struct Switches: View {
    var body: some View {
        VStack(spacing: .lg) {
            SizeControl()
            SpeedControl()
            LaunchAtLoginSwitch()
            LaunchSilentlySwitch()
            GravitySwitch()
            BounceOffOtherPets()
            MenuBarSwitch()
            DesktopInteractionsSwitch()
            FloatOverFullScreenAppsSwitch()
            RandomEventsSwitch()
            AnalyticsSettingsSwitch()
            #if DEBUG
                ResetAnalyticsConsentButton()
            #endif
        }
    }
}

// MARK: - Reset

struct FixOnScreenPets: View {
    var body: some View {
        Button(Lang.PetSelection.fixOnScreenPets) {
            @Inject var onScreen: OnScreenCoordinator
            onScreen.show()
        }
        .buttonStyle(.regular)
        .positioned(.leading)
    }
}

// MARK: - Random Events

private struct RandomEventsSwitch: View {
    @EnvironmentObject var appConfig: AppConfig

    @State var showingDetails = false

    var body: some View {
        SettingsSwitch(
            label: Lang.Settings.randomEventsTitle,
            value: $appConfig.randomEvents,
            showHelp: $showingDetails
        )
        .sheet(isPresented: $showingDetails) {
            VStack(alignment: .center, spacing: .xl) {
                Text(Lang.Settings.randomEventsTitle)
                    .font(.largeTitle)
                    .padding(.top)
                Text(Lang.Settings.randomEventsMessage)
                    .font(.body)
                    .multilineTextAlignment(.center)
                Button(Lang.cancel) { showingDetails = false }
                    .buttonStyle(.text)
            }
            .padding()
            .frame(when: .is(.macOS), width: 400)
        }
        .positioned(.leading)
    }
}

// MARK: - Gravity

struct GravitySwitch: View {
    @EnvironmentObject var appConfig: AppConfig

    var body: some View {
        SettingsSwitch(
            label: Lang.Settings.gravity,
            value: $appConfig.gravityEnabled
        )
        .positioned(.leading)
    }
}

// MARK: - Bounce off other pets

struct BounceOffOtherPets: View {
    @EnvironmentObject var appConfig: AppConfig

    var body: some View {
        SettingsSwitch(
            label: Lang.Settings.bounceOffPets,
            value: $appConfig.bounceOffPetsEnabled
        )
        .positioned(.leading)
    }
}

// MARK: - Pet Size

struct SizeControl: View {
    @EnvironmentObject var appConfig: AppConfig

    @State var text: String = ""

    var formattedValue: String {
        "\(Int(appConfig.petSize))"
    }

    var body: some View {
        HStack {
            Text(Lang.Settings.size)
                .textAlign(.leading)
            TextField(formattedValue, text: $text)
                .frame(width: 100)
                .textFieldStyle(.roundedBorder)
        }
        .onChange(of: text) { newText in
            guard let value = Float(newText) else { return }
            let newSize = max(min(CGFloat(value), PetSize.maxSize), PetSize.minSize)
            guard appConfig.petSize != newSize else { return }
            appConfig.petSize = newSize
        }
    }
}

// MARK: - Pet Speed Multiplier

struct SpeedControl: View {
    @EnvironmentObject var appConfig: AppConfig

    @State var text: String = ""

    var formattedValue: String {
        "\(Int(appConfig.speedMultiplier * 100))%"
    }

    var body: some View {
        HStack {
            Text(Lang.Settings.speed)
                .textAlign(.leading)
            TextField(formattedValue, text: $text)
                .frame(width: 100)
                .textFieldStyle(.roundedBorder)
        }
        .onChange(of: text) { newText in
            guard let value = Int(newText) else { return }
            let newSpeed = CGFloat(value) / 100
            guard appConfig.speedMultiplier != newSpeed else { return }
            guard newSpeed >= 0 && newSpeed <= 3 else { return }
            appConfig.speedMultiplier = newSpeed
        }
    }
}

// MARK: - Utils

struct SettingsSwitch: View {
    let label: String
    let value: Binding<Bool>
    var showHelp: Binding<Bool>?

    var body: some View {
        HStack {
            Text(label)
            if let showHelp {
                Image(systemName: "info.circle")
                    .font(.title2)
                    .onTapGesture { showHelp.wrappedValue = true }
            }
            Spacer()
            Toggle("", isOn: value).toggleStyle(.switch)
        }
    }
}
