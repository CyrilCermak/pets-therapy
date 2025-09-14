import SwiftUI
import Swinject

class Dependencies {
    static func setup() {
        let container = Container()
        container.registerSingleton(AppConfig.self) { _ in AppConfig() }
        container.registerSingleton(AppConfigStorage.self) { _ in AppConfigStorageImpl() }
        container.registerSingleton(OnScreenCoordinator.self) { _ in OnScreenCoordinatorImpl() }
        container.registerSingleton(PetsAssetsProvider.self) { _ in PetsAssetsProviderImpl() }
        container.registerSingleton(SpeciesNamesRepository.self) { _ in SpeciesNamesRepositoryImpl() }
        container.registerSingleton(SpeciesProvider.self) { _ in SpeciesProviderImpl() }
        container.registerSingleton(AnalyticsService.self) { _ in FirebaseAnalyticsService() }
        
        container.register(CommandLineUseCase.self) { _ in CommandLineUseCaseImpl() }
        container.register(CustomPetsResourcesProvider.self) { _ in CustomPetsResourcesProviderImpl() }
        container.register(DeletePetButtonCoordinator.self) { _ in DeletePetButtonCoordinatorImpl() }
        container.register(DeletePetUseCase.self) { _ in DeletePetUseCaseImpl() }
        container.register(DesktopObstaclesService.self) { _ in DesktopObstaclesServiceImpl() }
        container.register(ExportPetButtonCoordinator.self) { _ in ExportPetButtonCoordinatorImpl() }
        container.register(ExportPetUseCase.self) { _ in ExportPetUseCaseImpl() }
        container.register(ImportDragAndDropPetUseCase.self) { _ in ImportDragAndDropPetUseCaseImpl() }
        container.register(ImportVerifier.self) { _ in ImportVerifierImpl() }
        container.register(LaunchAtLoginUseCase.self) { _ in LaunchAtLoginUseCaseImpl() }
        container.register(MouseTrackingUseCase.self) { _ in MouseTrackingUseCaseImpl() }
        container.register(NotificationsService.self) { _ in NotificationsServiceImpl() }
        container.register(RainyCloudUseCase.self) { _ in RainyCloudUseCaseImpl() }
        container.register(RenamePetButtonCoordinator.self) { _ in RenamePetButtonCoordinatorImpl() }
        container.register(ThemeUseCase.self) { _ in ThemeUseCaseImpl() }
        container.register(WorldElementsService.self) { _ in WorldElementsServiceImpl() }
        container.register(ScreensaverElementsService.self) { _ in ScreensaverElementsServiceImpl() }
        container.register(UfoAbductionUseCase.self) { _ in UfoAbductionUseCaseImpl() }

        Container.main = container.synchronize()

        Capabilities.discovery = PetsCapabilitiesDiscoveryService()
    }
}
