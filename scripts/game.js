export default class Game{
    static DEFAULT_OPTIONS = {
        start : "FGSFDS",
        letters : "SDFG",
        strategic : false,
        bots : [0,0],
    }

    static TEMPLATES = {
        "FGSFDS" : {
            start : "FGSFDS",
            letters : "SDFG",
        },
        "F (Three letters)" : {
            start : "F",
            letters : "SDF",
        },
        "F (Four letters)" : {
            start : "F",
            letters : "SDFG",
        },
    }

    constructor(options) {
        this.options = options
        this.letters = options.letters
        this.sequence = options.start
        this.repeat = ""
        this.ended = false
        this.player = 0
        this.repeat = null

        this.getValidLetters()
    }

    getRepeat(letter = null) {
        let sequence = this.sequence
        if (letter === null) {
            letter = this.sequence.slice(-1)
            sequence = this.sequence.slice(0, -1)
        }

        const last = sequence.lastIndexOf(letter)

        if (last === -1)
            return null

        const end = sequence.slice(last) + letter

        if (sequence.indexOf(end) === -1)
            return null

        return end
    }

    advance(letter) {
        if (this.ended)
            return false

        if (letter === this.sequence.slice(-1))
            return false

        this.repeat = this.getRepeat(letter)

        this.sequence += letter

        if (this.repeat) {
            this.ended = true
            return true
        }

        this.player = 1 - this.player

        this.getValidLetters()

        if (this.valid === "")
            this.ended = true

        return true
    }

    getValidLetters() {
        this.valid = ""
        const last = this.sequence.slice(-1)

        for (let letter of this.letters) {
            if (letter === last)
                continue

            if (this.options.strategic) {
                if (this.getRepeat(letter) !== null)
                    continue
            }
            this.valid += letter
        }
    }

    getState(next = null) {
        if (next === this.sequence.slice(-1)) {
            return [this.sequence, null, "_"]
        }

        if (this.options.strategic) {
            const repeat = this.getRepeat(next)
            return [this.sequence, repeat, next ?? "_"]
        } else {
            if (this.ended)
                return [this.sequence, this.repeat, ""]
            return [this.sequence, null, next ?? "_"]
        }
    }
}