import Foundation
import Schwifty
import SwiftUI

protocol ExportPetButtonCoordinator {
    func view(for species: Species) -> AnyView
}

class ExportPetButtonCoordinatorImpl: ExportPetButtonCoordinator {
    func view(for species: Species) -> AnyView {
        guard DeviceRequirement.macOS.isSatisfied else {
            return AnyView(EmptyView())
        }
        let vm = ExportSpeciesButtonViewModel(species: species)
        return AnyView(
            ExportSpeciesButton(viewModel: vm)
        )
    }
}

private struct ExportSpeciesButton: View {
    @EnvironmentObject var appConfig: AppConfig
    @StateObject var viewModel: ExportSpeciesButtonViewModel

    var body: some View {
        if viewModel.isAvailable {
            IconButton(systemName: viewModel.icon, action: viewModel.export)
                .sheet(isPresented: viewModel.isAlertShown) {
                    VStack(spacing: .zero) {
                        if let title = viewModel.title {
                            Text(title).padding(.top, .lg)
                        }
                        Text(viewModel.message ?? "")
                            .padding(.top, .lg)
                            .padding(.bottom, .lg)
                        HStack {
                            Button(Lang.CustomPets.readTheDocs, action: viewModel.readTheDocs)
                                .buttonStyle(.text)
                            
                            Button(Lang.ok, action: viewModel.clearMessages)
                                .buttonStyle(.regular)
                        }
                    }
                    .padding(.md)
                }
        }
    }
}

private class ExportSpeciesButtonViewModel: ObservableObject {
    @Published var title: String?
    @Published var message: String?

    @Inject var exportPetUseCase: ExportPetUseCase

    let icon = "square.and.arrow.up.on.square"
    let isAvailable: Bool

    private let species: Species

    init(species: Species) {
        self.species = species
        self.isAvailable = !species.tags.contains("supporters-only")
    }

    lazy var isAlertShown: Binding<Bool> = Binding(
        get: { self.message != nil },
        set: { _ in }
    )

    func export() {
        exportPetUseCase.export(item: species) { [weak self] destination in
            Task { @MainActor [weak self] in
                self?.doneExporting(to: destination)
            }
        }
    }

    private func doneExporting(to destination: URL?) {
        if let destination {
            destination.visit()
            title = Lang.CustomPets.exportSuccess
            message = Lang.CustomPets.exportSuccessMessage
        } else {
            title = nil
            message = Lang.CustomPets.genericExportError
        }
    }

    func readTheDocs() {
        title = nil
        message = nil
        URL(string: Constants.URLs.customPetsDocs)?.visit()
    }

    func clearMessages() {
        withAnimation {
            title = nil
            message = nil
        }
    }
}
