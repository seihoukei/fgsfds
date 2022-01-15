export default class Game{
    static DEFAULT_OPTIONS = {
        start : "FGSFDS",
        letters : "SDFG",
        strategic : true,
        bots : [0,1],
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

    getRepeat(letter = null, sequence = this.sequence) {
        if (letter === null) {
            letter = sequence.slice(-1)
            sequence = sequence.slice(0, -1)
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

        this.getBotMove(this.options.bots[this.player])

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
        if (this.options.strategic) {
            if (next === this.sequence.slice(-1)) {
                return [this.sequence, null, "_"]
            }

            const repeat = this.getRepeat(next)
            return [this.sequence, repeat, next ?? "_"]
        } else {
            if (this.ended)
                return [this.sequence, this.repeat, ""]

            if (next === this.sequence.slice(-1)) {
                return [this.sequence, null, "_"]
            }

            return [this.sequence, null, next ?? "_"]
        }
    }

    getBotMove(level) {
        if (level === 0 || this.ended)
            return false

        if (level === 1) {
            return this.advance(this.valid[Math.random() * this.valid.length | 0])
        }

        const maxDepth = level * 4 - 7

        let bestTurn = ""
        let maxScore = -1
        for (let letter of this.valid) {
            let score = this.evaluateMove(maxDepth, this.sequence, letter, true)
//            console.log(this.sequence, letter, score)
            if (score > maxScore || score === maxScore && Math.random() > 0.5) {
                bestTurn = letter
                maxScore = score
            }
        }
        if (bestTurn !== "") {
//            console.log(bestTurn, maxScore)
            return this.advance(bestTurn)
        } else
            return this.advance(this.valid[Math.random() * this.valid.length | 0])
    }

    evaluateMove(depth, sequence, letter, me = true) {
        if (this.getRepeat(letter, sequence))
            return me ? -1 : 1

        if (depth <= 0)
            return 0

        let bestScore = null

        sequence = sequence + letter

        for (let next of this.letters) {
            if (letter === next)
                continue

            let score = this.evaluateMove(depth - 1, sequence, next, !me)
//            console.log(sequence, next, score)

            if (bestScore === null)
                bestScore = score

            if (!me && score > bestScore)
                bestScore = score

            if (me && score < bestScore)
                bestScore = score
        }

        return bestScore
    }
}
