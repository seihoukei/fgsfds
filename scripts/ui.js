import DOM from "./utility/dom.js"
import UILetter from "./ui-letter.js"
import Game from "./game.js"

export default class UI {
    constructor() {
        this.strategic = false
        this.botLevel = 1

        this.dvLayout = DOM.createDiv(document.body, "layout")

        this.dvMenu = DOM.createDiv(this.dvLayout, "header")

        this.dvNewGame = DOM.createDiv(this.dvMenu, "button", "New game")
        this.dvNewGame.onclick = () => window.newGame(this.game.options)

        this.dvConfigure = DOM.createDiv(this.dvMenu, "button", "Configure")
        this.dvConfigure.onclick = () => this.displayConfig(game.options)

        this.dvContainer = DOM.createDiv(this.dvLayout, "main-container")
        this.dvPlayer = DOM.createDiv(this.dvContainer, "player")
        this.dvLetters = DOM.createDiv(this.dvContainer, "letters")
        this.dvSequence = DOM.createDiv(this.dvContainer, "sequence")
        this.letters = {}

        this.dvConfigHolder = DOM.createDiv(document.body, "dialog-holder hidden")
        this.dvConfigHolder.onclick = (event) => {
            if (event.target === this.dvConfigHolder)
                this.hideConfig()
        }

        this.dvConfig = DOM.createDiv(this.dvConfigHolder, "dialog")
        this.dvConfigTitle = DOM.createDiv(this.dvConfig, "dialog-title", "Game configuration")

        this.dvConfigSymbolsLine = DOM.createDiv(this.dvConfig, "dialog-line")
        this.dvConfigSymbolsCaption = DOM.createDiv(this.dvConfigSymbolsLine, "dialog-caption", "Used symbols")
        this.dvConfigSymbolsInput = DOM.createElement("input", "dialog-input", this.dvConfigSymbolsLine)

        this.dvConfigStartLine = DOM.createDiv(this.dvConfig, "dialog-line")
        this.dvConfigStartCaption = DOM.createDiv(this.dvConfigStartLine, "dialog-caption", "Starting sequence")
        this.dvConfigStartInput = DOM.createElement("input", "dialog-input", this.dvConfigStartLine)

        this.dvConfigModeLine = DOM.createDiv(this.dvConfig, "dialog-line")
        this.dvConfigModeCaption = DOM.createDiv(this.dvConfigModeLine, "dialog-caption", "Game mode")

        this.dvConfigModeClassic = DOM.createDiv(this.dvConfigModeLine, "button", "Classic")
        this.dvConfigModeClassic.onclick = () => this.setStrategic(false)

        this.dvConfigModeStrategic = DOM.createDiv(this.dvConfigModeLine, "button", "Strategic")
        this.dvConfigModeStrategic.onclick = () => this.setStrategic(true)

        this.dvConfigOpponentCaptionLine = DOM.createDiv(this.dvConfig, "dialog-line centered", )
        this.dvConfigOpponentCaption = DOM.createDiv(this.dvConfigOpponentCaptionLine, "dialog-caption", "Opponent level")

        this.dvConfigOpponentButtonsLine = DOM.createDiv(this.dvConfig, "dialog-line centered unpadded")
        this.dvConfigOpponentButtons = []

        for (let i = 0; i < 6; i++) {
            const button = DOM.createDiv(this.dvConfigOpponentButtonsLine, "button", i || "Player")
            button.onclick = () => this.setBotLevel(i)

            this.dvConfigOpponentButtons.push(button)
        }

        this.dvConfigButtonLine = DOM.createDiv(this.dvConfig, "dialog-line centered padded")
        this.dvConfigModeSave = DOM.createDiv(this.dvConfigButtonLine, "button", "Save & New game")
        this.dvConfigModeSave.onclick = () => this.hideConfig(true)

        this.dvConfigModeCancel = DOM.createDiv(this.dvConfigButtonLine, "button", "Cancel")
        this.dvConfigModeCancel.onclick = () => this.hideConfig()

        this.dvConfigModeDefault = DOM.createDiv(this.dvConfigButtonLine, "button", "Default")
        this.dvConfigModeDefault.onclick = () => this.displayConfig(Game.DEFAULT_OPTIONS)

        document.body.onkeydown = (event) => this.press(event.code)
    }

    setLetters(letters) {
        for (let letter of Object.values(this.letters))
            letter.destroy()

        this.letters = {}

        for (let letter of letters) {
            this.letters[letter] = new UILetter(this, letter)
        }
    }

    setSequence(sequence, highlight = null, next = "_") {
        if (highlight !== null)
            sequence = sequence.replace(highlight, `<span class="repeat">${highlight}</span>`)

        sequence += `<span class="next">${next}</span>`
        this.dvSequence.innerHTML = sequence
    }

    showGame(game) {
        this.game = game
        this.setLetters(game.letters)
        this.updateGame()
    }

    updateGame(next) {
        this.setSequence(...this.game.getState(next))
        if (game.ended)
            this.dvPlayer.innerText = `Player ${game.player + 1} has lost.\n Press Space for new game.`
        else
            this.dvPlayer.innerText = `Player ${game.player + 1}'s turn`

        this.dvLetters.classList.toggle("ended", game.ended)
        this.dvLetters.classList.toggle("player1", game.player === 0)
        this.dvLetters.classList.toggle("player2", game.player === 1)

        for (let [letter, display] of Object.entries(this.letters))
            display.toggleDisabled(game.ended || game.valid.indexOf(letter) === -1)
    }

    advanceGame(letter) {
        if (!game.advance(letter))
            return
        this.updateGame()
    }

    press(code) {
        if (game.ended && code === "Space") {
            window.newGame(game.options)
        }
        if (code.slice(0,3) !== "Key")
            return
        const key = code.slice(3)
        this.letters[key]?.click()
    }

    displayConfig(options = game.options) {
        this.dvConfigStartInput.value = options.start
        this.dvConfigSymbolsInput.value = options.letters

        this.setStrategic(!!options.strategic)
        this.setBotLevel(options.bots?.[1] ?? 1)

        this.dvConfigHolder.classList.toggle("hidden", false)

    }

    hideConfig(save = false) {
        if (save) {
            game.options.letters = [...new Set([...this.dvConfigSymbolsInput.value.toUpperCase()])].join("").slice(0,6)
            game.options.start = this.dvConfigStartInput.value.toUpperCase()

            game.options.strategic = this.strategic

            game.options.bots ??= [0, 0]
            game.options.bots[1] = this.botLevel

            window.newGame(game.options)

            localStorage.fgsfds_options = JSON.stringify(game.options)
        }

        this.dvConfigHolder.classList.toggle("hidden", true)
    }

    setStrategic(value) {
        this.strategic = value
        this.dvConfigModeClassic.classList.toggle("active", !this.strategic)
        this.dvConfigModeStrategic.classList.toggle("active", this.strategic)
    }

    setBotLevel(level) {
        this.botLevel = level

        for (let i = 0; i < this.dvConfigOpponentButtons.length; i++) {
            this.dvConfigOpponentButtons[i].classList.toggle("active", i === level)
        }
    }
}