# Custom Pets

You can now create your own custom pets!

## TLDR;
### macOS
1. Click on a pet you like and export it (see below)
1. Modify the json file the sprites as you see fit
1. Double check filename (see [sprites section](#sprites))
1. Zip everything
1. Drag and drop the zip in the app
1. Show and share your work on [Discord](https://discord.gg/WvvnmPCy)!

I've also made a (terrible) tutorial, you can find it [on YouTube](https://www.youtube.com/watch?v=Mj4U2GIF8MA)! 

### Windows

Windows doesn't support all capabilities (it will just ignore unknown ones) yet, doesn't have the Info view with exporting pets functionality and does not have drag and drop system, but you can simply access the `PetAssets` or `Species` folders and add, modify or delete whatever it's in there!

## Setup
You only need two things: 
* An updated version of the app
* Some tool do design your own sprites (I use [Aseprite](https://github.com/aseprite/aseprite), but any other will work just fine!)

Building the app from source it's not required for creating custom pets, but you can build the app using Xcode if you want, here are [some instructions](https://github.com/curzel-it/bit-therapy) for that. 

## Species Definition
A `Species` is defined by the following: 
* A unique id
* A list of Capabilities
* A list of Animations
* Other attributes, such as speed or scale 

All of these need to be defined in a json file, for example:

``` json
{
  "id": "ape",
  "dragPath": "drag",
  "fallPath": "drag",
  "fps": 10,
  "zIndex": 0,
  "scale": 1,
  "tags": ["jungle"],
  "movementPath": "walk",
  "speed": 0.7,
  "capabilities": [
    "AnimatedSprite",
    "AnimationsProvider",
    "AnimationsScheduler",
    "AutoRespawn",
    "BounceOnLateralCollisions",
    "Draggable",
    "FlipHorizontallyWhenGoingLeft",
    "Gravity",
    "LinearMovement",
    "PetsSpritesProvider",
    "Rotating",
    "ShowsMenuOnRightClick"
  ],
  "animations": [
    {
      "id": "front",
      "position": "fromEntityBottomLeft",
      "requiredLoops": 5
    },
    ...
  ]
}
```

Complete json files for all original species can be found [here](https://github.com/curzel-it/bit-therapy/tree/main/Species).

> **Warning!**<br>
> Do not include `_` (underscore) in your `species.id`.<br>
> The `_` character is used to "separate" the name of the species from the name of the animation (`ape_eat` => `ape` + `eat`), so do `apechef` instead of `ape_chef`!

### Capabilities
Capabilities are behaviors that can be attached to a Pet to manipulate its state on update - some names are pretty self-explanatory, such as `BounceOnLateralCollisions`, `FlipHorizontallyWhenGoingLeft` or `Gravity`.

While I recommend using the set of capabilities in the example above for most pets, not all species have the same capabilities:
* Grumpy Cat has a special one called `GetsAngryWhenMeetingOtherCats`
* Snails are missing `BounceOnLateralCollisions` and have a special one called `WallCrawler`, which is what makes them "crawl" along the borders of your screen
* `RandomPlayformJumper` allows certain pets to "fly" to other windows on your screen

### Animations
Animations are picked randomly from the list at a random interval.

Each animation has: 
* `id` which determinates the sprite to be rendered
* `position` 
* `size` see sloth's [lightsaber animation](https://github.com/curzel-it/bit-therapy/blob/main/Species/sloth.json)
* `requiredLoops` number of times the animation will be repeated

Each species needs to have at least a `front` animation, which is loaded in homepage and pet details.

> **Warning!**<br>
> Do not include `_` (underscore) in your `animation.id`.<br>
> The `_` character is used to "separate" the name of the species from the name of the animation (`ape_eat` => `ape` + `eat`), so do `attackloop` instead of `attack_loop`!

### Other properties
* `movementPath` determinates which sprite set should be used to render the movement animation (usally `walk` or `fly`)
* `dragPath` determinates which sprite is used when the pet is being dragged around with the mouse (usually `drag` or `front`)
* `fallPath`, **v2.48+**, determinates which sprite is used when the pet is "falling" (optional, same as `dragPath` if not preset, see [mushroom](https://github.com/curzel-it/bit-therapy/blob/main/Species/mushroom.json) for an example) 
* `speed` is self-explanatory
* `fps` animations in some species are *slower* (such as snail or the sunflower), so no need to render them as fast

## Sprites
Each animations is composed of multiple sprites, each in a dedicated `png` image file.

Each file **must** follow this convention: 

`{species.id}_{animation.id}-{index}.png`.

Indeces can either start from 0 or 1, but need to follow an incremental and sequential order. Names are also case-sensitive.

For example:
* `ape_front-1.png`
* `ape_front-2.png`
* `ape_front-3.png`
* `ape_front-4.png`
* `ape_walk-0.png`
* `ape_walk-1.png`
* `ape_walk-2.png`
* `ape_walk-3.png`
* `sloth_swag_lightsaber-0.png`
* ...

To get you quickstarted, you can take a look at the [Aseprite files](https://github.com/curzel-it/bit-therapy/tree/main/Aseprite) for my pets!

Aseprite is a great tool, more info [here](https://github.com/aseprite/aseprite).

## Animation Duracy

All animations of a given species must have the same number of frames per second.

In the json file, you change the `fps` property to set framerate.

In order to save battery and processing power, the maximum frame rate is set to 20 fps.

I recommend sticking to 10 fps, or 100 milliseconds per frame.

## App Features
### Export
Go to the Info view in the bottom navigation bar to find and use the export functionality.
![Pet details showing export button](custompets-export.png)

### Import
Go to the Info view in the bottom navigation bar and drag your ZIP file to the designated drop area.
![Bottom of the homepage showing the drop area](custompets-droparea.png)
