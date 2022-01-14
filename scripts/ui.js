import DOM from "./utility/dom.js"
import UILetter from "./ui-letter.js"

export default class UI {
    constructor() {
        this.dvLayout = DOM.createDiv(document.body, "layout")

        this.dvMenu = DOM.createDiv(this.dvLayout, "header")

        this.dvNewGame = DOM.createDiv(this.dvMenu, "button", "New game")
        this.dvNewGame.onclick = () => window.newGame(this.game.options)

        this.dvConfigure = DOM.createDiv(this.dvMenu, "button", "Configure")
        this.dvConfigure.onclick = () => this.displayConfig()

        this.dvContainer = DOM.createDiv(this.dvLayout, "main-container")
        this.dvPlayer = DOM.createDiv(this.dvContainer, "player")
        this.dvLetters = DOM.createDiv(this.dvContainer, "letters")
        this.dvSequence = DOM.createDiv(this.dvContainer, "sequence")
        this.letters = {}

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

    displayConfig() {

    }
}