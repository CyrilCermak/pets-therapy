import Combine
import Schwifty
import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appConfig: AppConfig
    
    @StateObject private var viewModel = ContentViewModel()
    @StateObject private var shopViewModel = ShopViewModel()

    var body: some View {
        ZStack {
            Background()
            if !viewModel.isLoading {
                contents(of: viewModel.selectedPage).padding(.top, .md)
                TabBar(viewModel: viewModel)
                BackToHomeButton()
            }
        }
        .environmentObject(viewModel)
        .environmentObject(shopViewModel)
        .preferredColorScheme(viewModel.colorScheme)
    }

    @ViewBuilder private func contents(of page: AppPage) -> some View {
        switch page {
        case .about:
            AboutView()
                .environmentObject(AboutViewModel())
        case .petSelection: PetsSelectionView()
        case .screensaver: ScreensaverView()
        case .settings: SettingsView()
        case .none: EmptyView()
        }
    }
}

private class ContentViewModel: ObservableObject {
    @Inject private var appConfig: AppConfig
    @Inject private var species: SpeciesProvider
    @Inject private var theme: ThemeUseCase

    @Published var tabBarHidden: Bool = false
    @Published var isLoading: Bool = true
    @Published var backgroundImage: String = ""
    @Published var colorScheme: ColorScheme?
    @Published var selectedPage: AppPage = .petSelection
    @Published var backgroundBlurRadius: CGFloat = 10

    lazy var options: [AppPage] = {
        return [.petSelection, .screensaver, .settings, .about]
    }()

    private var disposables = Set<AnyCancellable>()

    init() {
        selectedPage = .petSelection
        backgroundImage = appConfig.background
        bindScreensaverSettings()
        bindBackground()
        bindColorScheme()
        bindLoading()
    }

    private func bindScreensaverSettings() {
        $selectedPage
            .sink { [weak self] selection in
                withAnimation {
                    self?.tabBarHidden = selection == .screensaver
                    self?.backgroundBlurRadius = selection == .screensaver ? 0 : 10
                }
            }
            .store(in: &disposables)
    }

    private func bindLoading() {
        species.all()
            .filter { !$0.isEmpty }
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                guard let self else { return }
                withAnimation {
                    self.isLoading = false
                }
            }
            .store(in: &disposables)
    }

    private func bindBackground() {
        appConfig.$background
            .sink { [weak self] in self?.backgroundImage = $0 }
            .store(in: &disposables)
    }

    private func bindColorScheme() {
        theme.theme()
            .sink { [weak self] theme in
                guard let self else { return }
                withAnimation {
                    self.colorScheme = theme.colorScheme
                }
            }
            .store(in: &disposables)
    }
}

extension ContentViewModel: TabBarViewModel {
    // ...
}

private struct BackToHomeButton: View {
    @EnvironmentObject var viewModel: ContentViewModel

    var body: some View {
        if viewModel.tabBarHidden {
            Image(systemName: "pawprint")
                .opacity(0.7)
                .font(.title)
                .onTapGesture {
                    withAnimation {
                        viewModel.selectedPage = .petSelection
                    }
                }
                .positioned(.leadingTop)
                .padding(.top, .lg)
                .padding(.leading, .md)
        }
    }
}

private struct Background: View {
    @EnvironmentObject private var viewModel: ContentViewModel

    var body: some View {
        GeometryReader { geometry in
            Image(viewModel.backgroundImage)
                .interpolation(.none)
                .resizable()
                .aspectRatio(contentMode: .fill)
                .frame(width: geometry.size.width + geometry.safeAreaInsets.horizontal + 20)
                .frame(height: geometry.size.height + geometry.safeAreaInsets.vertical + 20)
                .edgesIgnoringSafeArea(.all)
                .blur(radius: viewModel.backgroundBlurRadius)
        }
    }
}
