import AppKit
import Foundation

func printJSON(_ value: [String: Any]) {
    guard let data = try? JSONSerialization.data(withJSONObject: value, options: [.sortedKeys]),
          let text = String(data: data, encoding: .utf8) else { exit(1) }
    print(text)
}

if CommandLine.arguments.contains("--self-check") {
    printJSON(["ready": true, "picker": "NSOpenPanel", "version": 2,
               "bundleIdentifier": Bundle.main.bundleIdentifier ?? "",
               "bundlePath": Bundle.main.bundleURL.path,
               "executablePath": Bundle.main.executableURL?.path ?? ""] )
    exit(0)
}

let app = NSApplication.shared
app.setActivationPolicy(.regular)
let menu = NSMenu()
let applicationMenu = NSMenuItem()
menu.addItem(applicationMenu)
let applicationItems = NSMenu()
applicationItems.addItem(withTitle: "종료", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
applicationMenu.submenu = applicationItems
app.mainMenu = menu
app.finishLaunching()
app.activate(ignoringOtherApps: true)
let panel = NSOpenPanel()
panel.title = "UI 스튜디오 · 게임 프로젝트 폴더"
panel.message = "게임 프로젝트 폴더를 선택해 주세요. 선택한 폴더의 ui-studio 안에 UI 설계와 설명서를 저장합니다."
panel.prompt = "이 폴더 열기"
panel.canChooseDirectories = true
panel.canChooseFiles = false
panel.allowsMultipleSelection = false
panel.canCreateDirectories = false
panel.resolvesAliases = false
if panel.runModal() == .OK, let url = panel.url {
    printJSON(["directory": url.path])
} else {
    printJSON(["cancelled": true])
}
