import DOM from "./utility/dom.js"

export default class UILetter {
    constructor(ui, letter) {
        this.ui = ui
        this.letter = letter
        this.disabled = false
        this.dvDisplay = DOM.createDiv(this.ui.dvLetters, "letter", letter)

        this.dvDisplay.onmouseenter = () => {
            this.ui.updateGame(letter)
        }
        this.dvDisplay.onmouseleave = () => {
            this.ui.updateGame()
        }

        this.dvDisplay.onclick = this.click.bind(this)
    }

    click() {
        if (this.disabled)
            return
        this.ui.advanceGame(this.letter)
    }

    toggleDisabled(value) {
        this.disabled = value
        this.dvDisplay.classList.toggle("disabled", this.disabled)
    }

    destroy() {
        this.dvDisplay.remove()
    }
}