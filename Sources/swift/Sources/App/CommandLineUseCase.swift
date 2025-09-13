import Foundation
import Schwifty

protocol CommandLineUseCase {
    func handleCommandLineArgs()
}

class CommandLineUseCaseImpl: CommandLineUseCase {
    @Inject private var appConfig: AppConfig

    private let tag = "CommandLine"

    func handleCommandLineArgs() {
        loadCommandLineBackground()
        loadCommandLinePets()
        loadCommandLinePetSize()
    }

    private func loadCommandLineBackground() {
        let key = "background="
        let command = CommandLine.arguments.first { $0.starts(with: key) }
        guard let value = command?.replacingOccurrences(of: key, with: "") else { return }
        Logger.log(tag, "Loading background '\(value)' as per command line args")
        appConfig.background = value
    }

    private func loadCommandLinePetSize() {
        print(CommandLine.arguments)
        let key = "petSize="
        let command = CommandLine.arguments.first { $0.starts(with: key) }
        guard let value = command?.replacingOccurrences(of: key, with: "") else { return }
        guard let size = Double(value) else { return }
        Logger.log(tag, "Loading size '\(size)' as per command line args")
        appConfig.petSize = CGFloat(size)
    }

    private func loadCommandLinePets() {
        let key = "pets="
        let command = CommandLine.arguments.first { $0.starts(with: key) }
        guard let value = command?.replacingOccurrences(of: key, with: "") else { return }

        let species = value
            .components(separatedBy: ",")
            .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }

        Logger.log(tag, "Loading pets '\(species)' as per command line args")
        appConfig.replaceSelectedSpecies(with: species)
    }
}
