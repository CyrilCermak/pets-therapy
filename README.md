# BitTherapy (Desktop Pets)
This is the source code of my macOS app [BitTherapy](https://apps.apple.com/app/desktop-pets/id1575542220), which brings Desktop Pets to macOS! 🚀

Like the app? Join our [Discord](https://discord.gg/MCdEgXKSH5)!

## 🎮 Latest Releases & Supported System
|OS|Store|Binaries|Build from Source|
|---|---|---|---|
|macOS|[App Store](https://apps.apple.com/app/id1575542220)|n/a|[See instructions](#build-macos)|
|Windows (Beta)|Some day!|[Latest Beta](https://github.com/curzel-it/bit-therapy/releases/tag/windows-v1.0.0)|[See instructions](#build-windows)|

The Windows port of the app has been written with C#/WinForms from scratch and it's still missing quite a lot of features, but will get there eventually. It's currently in Beta and has only been tested on Windows 11 amd64.

## 🤔 What's a Desktop Pet?
It's just a cute little pet or animal that lives in your computer.

The most popular one was probably the [eSheep](https://github.com/Adrianotiger/desktopPet) for Windows 95.

Hope you like them too!

## 🔥 Screenshots (macOS)
![Homepage, light mode](docs/1.png)
![Settings, dark mode](docs/2.png)

## 🎨 Create custom pets
Starting from version 2.20 you can now create custom pets, please check [the documentation](https://pets-therapy.com/custom-pets.html).

You do not need any programming knowledge or dev tools to create your own pets, just design your characters and follow [the instructions](https://pets-therapy.com/custom-pets.html), good luck!

## 🙏 Contribute
Contributors get a shout out in the app, just saying... 😏
![Contributors, dark mode](docs/contributors.png)

If you wish to improve support for your language, join our [Discord](https://discord.gg/MCdEgXKSH5) and let us know!

## 🔔 Interoperability 
Since version 2.48 you can use `DistributedNotificationCenter` to send basic commands to your pets.

Here's the payload:
```json
{
    "subject": "sloth",
    "action": "eat",
    "x": 100,
    "y": 100
}
```
* `x` and `y` are optional
* `subject` is the id of a species
* `action` the id of an animation
You can look up species and their animations [here](https://github.com/curzel-it/bit-therapy/tree/main/Species).

Sample Python script to send out notifications:
```python
from Foundation import NSDistributedNotificationCenter, NSDictionary

def send_notification():
    notification_name = "it.curzel.pets.Api"
    message = {...}
    user_info = NSDictionary.dictionaryWithDictionary_(message)
    center = NSDistributedNotificationCenter.defaultCenter()
    center.postNotificationName_object_userInfo_deliverImmediately_(
        notification_name, None, user_info, True
    )

if __name__ == "__main__":
    send_notification()
```

## 🛠️ Build from Source
### macOS
<a name="build-macos"></a>
1. Download and setup Xcode
1. Open the `Sources/swift/BitTherapy.xcworkspace`
1. Run

### Windows
<a name="build-windows"></a>
1. Download and setup Visual Studio 2022
1. Open the `Sources/windows/BitTherapy.sln`
1. Run

## FAQ
### Linux Support?
The app works by creating a transparent full screen window, which displays a bunch of sprites.

The app relies on the fact that both macOS and Windows discards events (such as mouse clicks) that happen on a completely trasparent porting of the window. This way, the app is unable to track events and doens't get in the way of you using other apps.

* Can this work on Linux? Sure
* Have you tried Wine? Not yet (chances of success do seem quite low)
* Do I want to figure out how to make this work on X or Wayland? Nope....

Sorry!

## About me
I have a [YouTube Channel](https://www.youtube.com/@HiddenMugs) which has been gathering lots of dust lately.
